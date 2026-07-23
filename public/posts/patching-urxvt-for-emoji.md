# Patching urxvt to Render Color Emoji

_Published July 21st, 2026_

---

I run [i3](https://i3wm.org/) with **urxvt** as my terminal. It is fast, light, and very fun as a hobby env. However I noticed when I set up Neovim with a Nerd Font config that my file tree was full of little `[]` boxes where icons were supposed to be, and any emoji usage in the terminal showed up as a hollow square.

It turned out to be two separate problems with two separate fixes, and the second one meant building urxvt from source. Here is the whole thing from start to finish so you can follow along and get set up.

Everything below is on **Debian 13 (trixie)**, but the approach carries over to any distro.

---

## The Two Problems

It helps to know up front that "my glyphs are broken" is actually two different issues:

1. **Nerd Font icons** (folders, git branches, language logos). These live in the Unicode Private Use Area. urxvt can render them, it just needs a config nudge.
2. **Color emoji** (the actual 🎉 🔥 ✅ kind). These are color bitmap glyphs, and stock urxvt cannot draw them at all. This is the one that needs patching.

Let's do them in order.

---

## Part 1: Nerd Font Icons (Config Only)

Two things fix the boxes here.

First, make sure urxvt was built with `unicode3`, which lets it handle codepoints above `U+FFFF`. Newer Nerd Fonts put a lot of icons up there. Check your build:

```bash
urxvt --help 2>&1 | grep -o 'unicode3'
```

If that prints `unicode3`, you are good. Debian's package already includes it.

Second, tell urxvt to use the font's own glyphs instead of its built-in box-drawing characters, which is what produces a lot of the tofu. Open `~/.Xresources` and set your font plus these two options:

```
URxvt.font: xft:MesloLGS Nerd Font Mono:size=14
URxvt.skipBuiltinGlyphs: true
URxvt.letterSpace: 0
```

`skipBuiltinGlyphs: true` is the important one. `letterSpace: 0` just avoids clipped glyphs from any negative spacing. Use whatever Nerd Font you like, but stick with the **Mono** variant so the columns line up.

Reload your resources:

```bash
xrdb -merge ~/.Xresources
```

Open a fresh urxvt window (existing ones keep their old config) and your Nerd Font icons should render. If you want to grab Meslo, it comes from the [Nerd Fonts releases](https://github.com/ryanoasis/nerd-fonts/releases).

---

## Part 2: Color Emoji (This One Needs Patching)

Here is the annoying truth. urxvt draws through **libXft**, and color emoji support was added to libXft years ago, so the library can do it. But urxvt's own glyph handling is strict about font metrics and rejects the color bitmap strikes that fonts like Noto Color Emoji ship. Even with a modern libXft, you get blank space where the emoji should be.

There is no config flag that fixes this. The only real solution is to rebuild urxvt with two patches. I install my build into `~/.local` so it shadows the system package on my `PATH` and never gets clobbered by an `apt` upgrade.

### Step 1: Install the emoji and symbol fonts

```bash
sudo apt-get install -y fonts-noto-color-emoji fonts-noto-core
```

### Step 2: Add the fonts to your fallback chain

Back in `~/.Xresources`, extend the font line so urxvt falls back to the symbol and emoji fonts for anything your main font does not cover:

```
URxvt.font: xft:MesloLGS Nerd Font Mono:size=14,xft:Noto Sans Symbols:size=11,xft:Noto Sans Symbols2:size=11,xft:Noto Color Emoji:size=11
```

Then reload:

```bash
xrdb -merge ~/.Xresources
```

### Step 3: Install the build dependencies

```bash
sudo apt-get install -y build-essential libx11-dev libxft-dev libxt-dev \
  libxext-dev libperl-dev libptytty-dev libstartup-notification0-dev
```

### Step 4: Get the urxvt source

I pulled the exact `9.31` source straight from the Debian pool so it matches the packaged version:

```bash
mkdir -p ~/.local/src/urxvt-emoji && cd ~/.local/src/urxvt-emoji

curl -fsSL -o urxvt-orig.tar.bz2 \
  http://deb.debian.org/debian/pool/main/r/rxvt-unicode/rxvt-unicode_9.31.orig.tar.bz2

mkdir -p build
tar xjf urxvt-orig.tar.bz2 -C build --strip-components=1
```

### Step 5: Get the two patches

The wide-glyphs patch stops urxvt from rejecting glyphs that are wider than their cell, and the font-rendering patch fixes the emoji metrics so the scaled bitmaps land in the right place. Both come from the `rxvt-unicode-truecolor-wide-glyphs` AUR package.

```bash
cd ~/.local/src/urxvt-emoji

curl -fsSL -o enable-wide-glyphs.patch \
  https://raw.githubusercontent.com/blueyed/PKGBUILD-rxvt-unicode-wide/master/enable-wide-glyphs.patch

curl -fsSL -o improve-font-rendering.patch \
  "https://aur.archlinux.org/cgit/aur.git/plain/improve-font-rendering.patch?h=rxvt-unicode-truecolor-wide-glyphs&id=69701a09c2c206233952b84bc966407f6774f1dc"
```

### Step 6: Apply, build, and install

Note the different `-p` levels. The two patches were cut with different path prefixes, so they need different strip levels. The `--fuzz=3` gives `patch` some slack against the exact line numbers.

```bash
cd ~/.local/src/urxvt-emoji/build

patch -p1 --fuzz=3 < ../enable-wide-glyphs.patch
patch -p0 --fuzz=3 < ../improve-font-rendering.patch

./configure --prefix="$HOME/.local" \
  --enable-unicode3 --enable-wide-glyphs --enable-xft --enable-font-styles \
  --enable-256-color --enable-fading --enable-transparency --enable-perl \
  --with-term=rxvt-unicode-256color

make -j"$(nproc)"
make install
```

### Step 7: Make sure your build wins on PATH

The install drops `urxvt` into `~/.local/bin`. Make sure that directory comes before `/usr/bin` on your `PATH` so your patched build is the one that launches:

```bash
command -v urxvt   # should print /home/YOU/.local/bin/urxvt
```

If it points at `/usr/bin/urxvt`, add this to your shell profile and log back in:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

---

## Verifying It Works

Open a brand new urxvt window and print a mix of a color emoji, a plain symbol, and a Nerd Font icon:

```bash
python3 -c 'print("emoji: \U0001F389 \U00002705 \U0001F525"); print("nerd:  \U000F031B")'
```

You should see a party popper, a green check, and a fire, all in color, followed by the Nerd Font logo. No boxes, no blanks.

---

## Keeping It Rebuildable

Because the source and patches all live in `~/.local/src/urxvt-emoji`, rebuilding after a system change is a two-line job. I keep a small `rebuild.sh` in that folder that untars a clean copy, reapplies both patches, and runs the `configure` and `make install` from Step 6. If a future `libXft` update ever breaks something, I just run it again.

One nice side effect of installing to `~/.local`: `apt` upgrades to the system `rxvt-unicode` package cannot touch my build, and my copy always wins on `PATH`.

---

## Sources

Everything I leaned on to piece this together:

- [rxvt-unicode source (Debian pool)](http://deb.debian.org/debian/pool/main/r/rxvt-unicode/)
- [rxvt-unicode-truecolor-wide-glyphs (AUR)](https://aur.archlinux.org/packages/rxvt-unicode-truecolor-wide-glyphs) (both patches)
- [enable-wide-glyphs.patch (blueyed)](https://github.com/blueyed/PKGBUILD-rxvt-unicode-wide)
- [rxvt-unicode-emoji variant (NixOS PR #157283)](https://github.com/NixOS/nixpkgs/pull/157283), the recipe that showed both patches were needed
- [Nerd Fonts FAQ and Troubleshooting](https://github.com/ryanoasis/nerd-fonts/wiki/FAQ-and-Troubleshooting)
- [rxvt-unicode on the ArchWiki](https://wiki.archlinux.org/title/Rxvt-unicode)
- [Nerd Fonts releases](https://github.com/ryanoasis/nerd-fonts/releases)
