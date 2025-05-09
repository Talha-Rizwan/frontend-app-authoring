import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import {
  ModalDialog,
  Button,
} from '@openedx/paragon';

import messages from './messages';

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  templateName,
  isDeleting,
}) => (
  <ModalDialog
    isOpen={isOpen}
    onClose={onClose}
    size="sm"
    hasCloseButton
  >
    <ModalDialog.Header>
      <ModalDialog.Title>
        <FormattedMessage
          id="templates.delete.title"
          defaultMessage="Delete Template"
        />
      </ModalDialog.Title>
    </ModalDialog.Header>

    <ModalDialog.Body>
      <p>
        <FormattedMessage
          {...messages.confirmDelete}
          values={{ templateName }}
        />
      </p>
    </ModalDialog.Body>

    <ModalDialog.Footer>
      <Button
        variant="tertiary"
        onClick={onClose}
      >
        <FormattedMessage
          id="templates.delete.cancel"
          defaultMessage="Cancel"
        />
      </Button>
      <Button
        variant="danger"
        onClick={onConfirm}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
        ) : (
          <FormattedMessage {...messages.deleteButton} />
        )}
      </Button>
    </ModalDialog.Footer>
  </ModalDialog>
);

DeleteConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  templateName: PropTypes.string.isRequired,
  isDeleting: PropTypes.bool,
};

DeleteConfirmationModal.defaultProps = {
  isDeleting: false,
};

export default DeleteConfirmationModal; 