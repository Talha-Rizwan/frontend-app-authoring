import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import {
  Form,
  Button,
  ModalDialog,
  Alert,
} from '@openedx/paragon';

import messages from './messages';

const TemplateForm = ({
  isOpen,
  onClose,
  onSubmit,
  isEditing,
  initialData,
}) => {
  const intl = useIntl();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    course_template: '',
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData && isEditing) {
      setFormData({
        name: initialData.courses_name || '',
        description: initialData.metadata?.description || '',
        course_template: initialData.zip_url || '',
      });
      
      // We can't populate file inputs with existing files, 
      // but we can show the thumbnail preview if it exists
      if (initialData.metadata?.thumbnail) {
        setThumbnailPreview(initialData.metadata.thumbnail);
      }
    } else {
      // Reset form when opening for create
      setFormData({ 
        name: '', 
        description: '',
        course_template: '',
      });
      setThumbnail(null);
      setThumbnailPreview('');
    }
  }, [initialData, isEditing, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    
    if (name === 'thumbnail') {
      const file = files[0];
      setThumbnail(file);
      
      // Create a preview URL for the thumbnail
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setThumbnailPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setThumbnailPreview('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Prepare form data for submission
      const submissionData = new FormData();
      submissionData.append('name', formData.name);
      submissionData.append('description', formData.description);
      
      // Append the course template URL
      if (formData.course_template) {
        submissionData.append('course_template', formData.course_template);
      } else {
        // Course template is required
        throw new Error(intl.formatMessage({ 
          id: 'templates.form.error.noTemplateUrl',
          defaultMessage: 'Please provide a course template URL',
        }));
      }
      
      if (thumbnail) {
        submissionData.append('thumbnail', thumbnail);
      }

      await onSubmit(submissionData, initialData?.id);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalDialog
      title={
        isEditing 
          ? intl.formatMessage(messages.editTemplateHeader)
          : intl.formatMessage(messages.createTemplateHeader)
      }
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      hasCloseButton
    >
      <ModalDialog.Header>
        <ModalDialog.Title>
          {isEditing 
            ? <FormattedMessage {...messages.editTemplateHeader} />
            : <FormattedMessage {...messages.createTemplateHeader} />
          }
        </ModalDialog.Title>
      </ModalDialog.Header>
      
      <ModalDialog.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>
              <FormattedMessage {...messages.formNameLabel} />
            </Form.Label>
            <Form.Control
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mt-3">
            <Form.Label>
              <FormattedMessage {...messages.formDescriptionLabel} />
            </Form.Label>
            <Form.Control
              name="description"
              as="textarea"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>
          
          <Form.Group className="mt-3">
            <Form.Label>
              <FormattedMessage {...messages.formTemplateUrlLabel} />
            </Form.Label>
            <Form.Control
              name="course_template"
              type="url"
              value={formData.course_template}
              onChange={handleChange}
              placeholder="https://example.com/template.gz"
              required
            />
            <Form.Text>
              {intl.formatMessage({
                id: 'templates.form.template.url.help',
                defaultMessage: 'Enter the URL to the course template file (.gz)',
              })}
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mt-3">
            <Form.Label>
              <FormattedMessage {...messages.formThumbnailLabel} />
            </Form.Label>
            <Form.Control
              name="thumbnail"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {thumbnailPreview && (
              <div className="mt-2">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  style={{ maxWidth: '200px', maxHeight: '150px' }}
                  className="mt-2"
                />
              </div>
            )}
          </Form.Group>
        </Form>
      </ModalDialog.Body>
      
      <ModalDialog.Footer>
        <Button
          variant="tertiary"
          onClick={onClose}
        >
          <FormattedMessage {...messages.formCancelButton} />
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
          ) : (
            <FormattedMessage {...messages.formSubmitButton} />
          )}
        </Button>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

TemplateForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
  initialData: PropTypes.shape({
    id: PropTypes.string,
    courses_name: PropTypes.string,
    zip_url: PropTypes.string,
    metadata: PropTypes.shape({
      description: PropTypes.string,
      thumbnail: PropTypes.string,
    }),
  }),
};

TemplateForm.defaultProps = {
  isEditing: false,
  initialData: null,
};

export default TemplateForm; 