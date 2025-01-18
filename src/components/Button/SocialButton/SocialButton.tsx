import { Button } from '@mantine/core';
import { IconBrandGithub, IconBrandLinkedin } from '@tabler/icons-react';
interface SocialButtonProps {
  platform: 'Github' | 'Linkedin';
}

const SocialButton = ({ platform }: SocialButtonProps) => {
  switch (platform) {
    case 'Github':
      return (
        <Button
          variant="light"
          color="gray"
          component="a"
          href="https://github.com/tyrellcurry"
          target="_blank"
        >
          <IconBrandGithub stroke={1.5} />
        </Button>
      );
    case 'Linkedin':
      return (
        <Button
          variant="light"
          color="gray"
          component="a"
          href="https://www.linkedin.com/in/tyrellcurry/"
          target="_blank"
        >
          <IconBrandLinkedin stroke={1.5} />
        </Button>
      );
    default:
      null;
  }
};

export default SocialButton;
