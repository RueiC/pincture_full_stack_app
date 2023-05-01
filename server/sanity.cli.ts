import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: '4boapu38',
    dataset: 'production',
  },
  server: {
    hostname: 'localhost',
    port: 3333,
  },
});
