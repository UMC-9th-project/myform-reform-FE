import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import Button2 from '../components/common/button_tmp/button2';

const meta = {
  title: 'Common/Button/Button2',
  component: Button2,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'disabled'],
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
} satisfies Meta<typeof Button2>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    children: 'Default Button',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'disabled',
    children: 'Disabled Button',
  },
};
