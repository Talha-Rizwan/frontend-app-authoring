import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import { Button, Alert } from '@openedx/paragon';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import messages from './messages';
import TemplateCard from './TemplateCard';
import TemplateForm from './TemplateForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import './CustomTemplates.scss';

const CustomTemplates = ({ courseId, organization }) => {
  const intl = useIntl();
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: '', variant: '' });
  
  // Form modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  
  // Delete confirmation modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showNotification = (message, variant) => {
    setNotification({ message, variant });
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      setNotification({ message: '', variant: '' });
    }, 5000);
  };

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${getConfig().STUDIO_BASE_URL}/api/contentstore/v0/course-import-templates/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getConfig().CSRF_TOKEN,
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      const templatesWithIds = data.results.map((template) => ({
        id: template.id.toString(),
        courses_name: template.name,
        zip_url: template.course_template,
        metadata: {
          title: template.name,
          description: template.description,
          thumbnail: template.thumbnail,
        },
      }));
      
      setTemplates(templatesWithIds);
      setError(null);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [organization]);

  const handleImportCourse = async (templateId, importUrl) => {
    try {
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = importUrl;
      link.download = `template-${templateId}.zip`; // Set the download filename
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading template:', error);
      showNotification(intl.formatMessage(messages.importError), 'danger');
    }
  };

  const handleCreateTemplate = () => {
    setIsEditing(false);
    setCurrentTemplate(null);
    setShowFormModal(true);
  };

  const handleEditTemplate = (template) => {
    setIsEditing(true);
    setCurrentTemplate(template);
    setShowFormModal(true);
  };

  const handleDeleteTemplate = (templateId) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setTemplateToDelete(template);
      setShowDeleteModal(true);
    }
  };

  const handleFormSubmit = async (formData, templateId) => {
    try {
      let url = `${getConfig().STUDIO_BASE_URL}/api/contentstore/v0/course-import-templates/`;
      let method = 'post';
      
      if (isEditing && templateId) {
        url = `${url}${templateId}/`;
        method = 'put';
      }
      
      // Get the course_template URL from the form data
      const courseTemplateUrl = formData.get('course_template');
      formData.delete('course_template');
      formData.append('course_template', courseTemplateUrl);
      
      // Use getAuthenticatedHttpClient for CSRF/auth handling
      const client = getAuthenticatedHttpClient();
      const response = await client[method](url, formData);
      
      if (response.status < 200 || response.status >= 300) {
        const errorData = response.data;
        throw new Error(errorData?.error || `HTTP error! Status: ${response.status}`);
      }
      
      // Refresh the templates list
      await fetchTemplates();
      
      // Show success message
      const message = isEditing
        ? intl.formatMessage(messages.updateSuccess)
        : intl.formatMessage(messages.createSuccess);
      
      showNotification(message, 'success');
    } catch (err) {
      console.error('Error submitting template:', err);
      const message = isEditing
        ? intl.formatMessage(messages.updateError)
        : intl.formatMessage(messages.createError);
      
      showNotification(message, 'danger');
      throw err; // Re-throw to be handled by the form component
    }
  };

  const handleConfirmDelete = async () => {
    if (!templateToDelete) return;
    
    try {
      setIsDeleting(true);
      const client = getAuthenticatedHttpClient();
      const response = await client.delete(
        `${getConfig().STUDIO_BASE_URL}/api/contentstore/v0/course-import-templates/${templateToDelete.id}/`
      );
      
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      // Remove the template from the list
      setTemplates((prevTemplates) => prevTemplates.filter((t) => t.id !== templateToDelete.id));
      showNotification(intl.formatMessage(messages.deleteSuccess), 'success');
    } catch (err) {
      console.error('Error deleting template:', err);
      showNotification(intl.formatMessage(messages.deleteError), 'danger');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setTemplateToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="templates-loading">
        <span className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="templates-error">
        <FormattedMessage
          id="templates.error.loading"
          defaultMessage="Error loading templates: {error}"
          values={{ error }}
        />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {intl.formatMessage(messages.pageTitle, { organization })}
        </title>
      </Helmet>
      
      <div className="page-header">
        <div className="container">
          <h2>
            <FormattedMessage
              id="templates.header"
              defaultMessage="{organization} Templates List"
              values={{ organization }}
            />
          </h2>
        </div>
      </div>

      <div className="container">
        {notification.message && (
          <Alert variant={notification.variant} className="mb-3" dismissible>
            {notification.message}
          </Alert>
        )}
        
        <div className="d-flex justify-content-end mb-3">
          <Button
            variant="primary"
            onClick={handleCreateTemplate}
          >
            <FormattedMessage {...messages.createButton} />
          </Button>
        </div>
        
        <div className="courses-container">
          {templates.length === 0 ? (
            <div className="templates-empty">
              <FormattedMessage
                id="templates.empty"
                defaultMessage="No templates available for {organization}"
                values={{ organization }}
              />
            </div>
          ) : (
            templates.map((template) => (
              <TemplateCard 
                key={template.id} 
                template={template} 
                onImport={handleImportCourse}
                onEdit={handleEditTemplate}
                onDelete={handleDeleteTemplate}
              />
            ))
          )}
        </div>
      </div>
      
      {/* Template Form Modal */}
      <TemplateForm
        isOpen={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        isEditing={isEditing}
        initialData={currentTemplate}
      />
      
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        templateName={templateToDelete?.courses_name || ''}
        isDeleting={isDeleting}
      />
    </>
  );
};

CustomTemplates.propTypes = {
  courseId: PropTypes.string.isRequired,
  organization: PropTypes.string.isRequired,
};

export default CustomTemplates;