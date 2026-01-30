import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import Button from '../components/common/button_tmp/button1';

const meta = {
  title: 'Common/Button/Button1',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'big'],
      description: '버튼 크기',
    },
    variant: {
      control: 'select',
      options: ['primary', 'disabled', 'outlined-mint', 'white'],
      description: '버튼 스타일 변형',
    },
    disabled: {
      control: 'boolean',
      description: '버튼 비활성화 여부',
    },
    children: {
      control: 'text',
      description: '버튼 텍스트',
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'default',
    children: 'Primary Button',
  },
};

export const PrimaryBig: Story = {
  args: {
    variant: 'primary',
    size: 'big',
    children: 'Primary Big Button',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'disabled',
    size: 'default',
    children: 'Disabled Button',
  },
};

export const OutlinedMint: Story = {
  args: {
    variant: 'outlined-mint',
    size: 'default',
    children: 'Outlined Mint Button',
  },
};

export const OutlinedMintBig: Story = {
  args: {
    variant: 'outlined-mint',
    size: 'big',
    children: 'Outlined Mint Big Button',
  },
};

export const White: Story = {
  args: {
    variant: 'white',
    size: 'default',
    children: 'White Button',
  },
};

export const WhiteBig: Story = {
  args: {
    variant: 'white',
    size: 'big',
    children: 'White Big Button',
  },
};
