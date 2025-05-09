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
  editButton: {
    id: 'templates.edit.button',
    defaultMessage: 'Edit',
    description: 'Text for the edit template button',
  },
  deleteButton: {
    id: 'templates.delete.button',
    defaultMessage: 'Delete',
    description: 'Text for the delete template button',
  },
  createButton: {
    id: 'templates.create.button',
    defaultMessage: 'Create New Template',
    description: 'Text for the create template button',
  },
  confirmDelete: {
    id: 'templates.delete.confirm',
    defaultMessage: 'Are you sure you want to delete this template?',
    description: 'Confirmation message for template deletion',
  },
  deleteSuccess: {
    id: 'templates.delete.success',
    defaultMessage: 'Template deleted successfully',
    description: 'Success message after template deletion',
  },
  deleteError: {
    id: 'templates.delete.error',
    defaultMessage: 'Failed to delete template. Please try again.',
    description: 'Error message when template deletion fails',
  },
  createSuccess: {
    id: 'templates.create.success',
    defaultMessage: 'Template created successfully',
    description: 'Success message after template creation',
  },
  createError: {
    id: 'templates.create.error',
    defaultMessage: 'Failed to create template. Please try again.',
    description: 'Error message when template creation fails',
  },
  updateSuccess: {
    id: 'templates.update.success',
    defaultMessage: 'Template updated successfully',
    description: 'Success message after template update',
  },
  updateError: {
    id: 'templates.update.error',
    defaultMessage: 'Failed to update template. Please try again.',
    description: 'Error message when template update fails',
  },
  formNameLabel: {
    id: 'templates.form.name.label',
    defaultMessage: 'Template Name',
    description: 'Label for template name field',
  },
  formDescriptionLabel: {
    id: 'templates.form.description.label',
    defaultMessage: 'Description',
    description: 'Label for template description field',
  },
  formTemplateFileLabel: {
    id: 'templates.form.template.label',
    defaultMessage: 'Course Template File (.gz)',
    description: 'Label for template file field',
  },
  formTemplateUrlLabel: {
    id: 'templates.form.template.url.label',
    defaultMessage: 'Course Template URL (.gz)',
    description: 'Label for template URL field',
  },
  formThumbnailLabel: {
    id: 'templates.form.thumbnail.label',
    defaultMessage: 'Thumbnail Image (optional)',
    description: 'Label for thumbnail image field',
  },
  formSubmitButton: {
    id: 'templates.form.submit',
    defaultMessage: 'Submit',
    description: 'Text for the submit button on template form',
  },
  formCancelButton: {
    id: 'templates.form.cancel',
    defaultMessage: 'Cancel',
    description: 'Text for the cancel button on template form',
  },
  editTemplateHeader: {
    id: 'templates.edit.header',
    defaultMessage: 'Edit Template',
    description: 'Header for the edit template modal',
  },
  createTemplateHeader: {
    id: 'templates.create.header',
    defaultMessage: 'Create New Template',
    description: 'Header for the create template modal',
  },
});

export default messages; 