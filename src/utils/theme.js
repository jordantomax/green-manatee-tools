import { Container, createTheme } from '@mantine/core';
import { PRIMARY_COLOR } from '@/utils/color';

const CONTAINER_SIZES = {
  xxs: 360,
  xs: 540,
  sm: 720,
  md: 960,
  lg: 1140,
  xl: 1320,
};

export const theme = createTheme({
  primaryColor: PRIMARY_COLOR,
  fontFamily: 'system-ui, -apple-system, sans-serif',
  cursorType: 'pointer',
  components: {
    Combobox: {
      defaultProps: {
        width: 300,
        position: 'bottom-start',
        withArrow: true
      },
      styles: {
        options: {
          maxHeight: 200,
          overflowY: 'auto',
        }
      }
    },
    Container: Container.extend({
      defaultProps: {
        p: 'sm',
      }
    }),
    AppShell: {
      defaultProps: {
        padding: 'lg',
        navbar: { width: 210 }
      }
    },
    Table: {
      defaultProps: {
        verticalSpacing: 'sm'
      }
    },
    Badge: {
      defaultProps: {
        size: 'md'
      }
    },
    Title: {
      styles: {
        root: {
          fontWeight: 600
        }
      }
    },
    Card: {
      defaultProps: {
        shadow: 'sm',
        p: 'lg',
        radius: 'md',
        withBorder: true
      },
    },
    Paper: {
      defaultProps: {
        withBorder: true,
        radius: 'md',
        p: 'lg',
        shadow: '0'
      }
    },
    Modal: {
      defaultProps: {
        size: 'lg'
      },
      styles: {
        header: {
          position: 'static'
        },
        title: {
          fontWeight: 500
        }
      }
    },
    SegmentedControl: {
      styles: {
        label: {
          marginBottom: 0
        }
      }
    }
  }
}); 