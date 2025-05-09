import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { Button } from '@openedx/paragon';

import messages from './messages';
import './TemplateCard.scss';

const TemplateCard = ({ template, onImport, onEdit, onDelete }) => {
  const {
    id,
    courses_name: courseName,
    zip_url: zipUrl,
    metadata,
  } = template;

  const handleImport = () => {
    onImport(id, zipUrl);
  };

  const handleEdit = () => {
    onEdit(template);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <div className="course-card">
      <div className="course-thumbnail">
        <img 
          src={metadata?.thumbnail || '/static/images/placeholder-course.jpg'} 
          alt={metadata?.title || 'Course template'} 
        />
      </div>
      <div className="course-info">
        <h3 className="course-name">{courseName}</h3>
        <h4 className="course-title">{metadata?.title}</h4>
        <p className="course-description">{metadata?.description}</p>
        <div className="course-actions">
          <button
            type="button"
            className="import-button"
            onClick={handleImport}
          >
            <FormattedMessage {...messages.importButton} />
          </button>
          <Button
            variant="outline-primary"
            className="ml-2"
            onClick={handleEdit}
          >
            <FormattedMessage {...messages.editButton} />
          </Button>
          <Button
            variant="outline-danger"
            className="ml-2"
            onClick={handleDelete}
          >
            <FormattedMessage {...messages.deleteButton} />
          </Button>
        </div>
      </div>
    </div>
  );
};

TemplateCard.propTypes = {
  template: PropTypes.shape({
    id: PropTypes.string.isRequired,
    courses_name: PropTypes.string.isRequired,
    zip_url: PropTypes.string.isRequired,
    metadata: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      thumbnail: PropTypes.string,
    }),
  }).isRequired,
  onImport: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TemplateCard; 