import { defineConfig } from 'sanity';
import { createClient, type ClientConfig } from '@sanity/client';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import dotenv from 'dotenv';
import { schemaTypes } from './schemas/index.js';

dotenv.config();

export default defineConfig({
  projectId: '4boapu38',
  dataset: 'production',
  plugins: [deskTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});

export const client = createClient({
  projectId: '4boapu38',
  dataset: 'production',
  apiVersion: '2022-09-13',
  useCdn: false,
  token: process.env.SANITY_SECRET_TOKEN,
});
