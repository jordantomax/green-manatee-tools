import { Container, createTheme, rem } from '@mantine/core';

const CONTAINER_SIZES = {
  xxs: 360,
  xs: 540,
  sm: 720,
  md: 960,
  lg: 1140,
  xl: 1320,
};

export const theme = createTheme({
  primaryColor: 'green',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  cursorType: 'pointer',
  components: {
    Container: Container.extend({
      vars: (_, { size, fluid }) => ({
        root: {
          '--container-size': fluid
            ? '100%'
            : size !== undefined && size in CONTAINER_SIZES
              ? rem(CONTAINER_SIZES[size])
              : rem(size),
        },
      }),
    }),
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
          fontWeight: 500
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