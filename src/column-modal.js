import Modal from 'react-bootstrap/Modal';

const ColumnModal = (props) => {
    return (
      <Modal
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={props.openColumnModal}
        onHide={() => props.toggleColumnModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Reorder Columns
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className='custom-table-column-reorder-list' onDragOver={props.onDragOver}>
            {Object.keys(props.columns).map((header, index) => {
              return <li
                key={`column-checkbox-${index}`}
                data-id={index}
                draggable='true'
                onDragEnd={props.onDragEnd}
                onDragStart={props.onDragStart}
              >
                {props.columns[header].head}
                
              </li>
            })}
          </ul>
        </Modal.Body>
      </Modal>
    );
  }

export default ColumnModal;