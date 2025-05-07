import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  pageTitle: {
    id: 'templates.page.title',
    defaultMessage: '{organization} Templates List',
    description: 'Title for the templates page',
  },
  header: {
    id: 'templates.header',
    defaultMessage: '{organization} Templates List',
    description: 'Header for the templates page',
  },
  empty: {
    id: 'templates.empty',
    defaultMessage: 'No templates available for {organization}',
    description: 'Message displayed when no templates are available',
  },
  importError: {
    id: 'templates.import.error',
    defaultMessage: 'Failed to import the course. Please try again.',
    description: 'Error message displayed when course import fails',
  },
  importButton: {
    id: 'templates.import.button',
    defaultMessage: 'Import Course',
    description: 'Text for the import course button',
  },
});

export default messages; 