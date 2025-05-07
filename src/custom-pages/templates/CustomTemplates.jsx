import { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from '@edx/frontend-platform/i18n';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';

import messages from './messages';
import TemplateCard from './TemplateCard';
import './CustomTemplates.scss';

const CustomTemplates = ({ courseId, organization }) => {
  const intl = useIntl();
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/awais786/courses/refs/heads/main/edly_courses.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      const templatesWithIds = data.map((template, index) => ({
        id: (index + 1).toString(),
        ...template,
      }));
      
      setTemplates(templatesWithIds);
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
      const apiUrl = `${getConfig().LMS_BASE_URL}/api/course_import_api/import/${templateId}/`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getConfig().CSRF_TOKEN,
        },
        body: JSON.stringify({ file_url: importUrl }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      await response.json();
      window.location.href = `/course/${templateId}`;
    } catch (error) {
      console.error('Error importing course:', error);
      alert(intl.formatMessage(messages.importError));
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
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

CustomTemplates.propTypes = {
  courseId: PropTypes.string.isRequired,
  organization: PropTypes.string.isRequired,
};

export default CustomTemplates;