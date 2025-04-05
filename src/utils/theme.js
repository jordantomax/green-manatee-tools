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
  primaryColor: 'dark',
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
    }
  },
}); 