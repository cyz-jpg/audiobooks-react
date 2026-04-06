import UpdateForm from './UpdateForm.jsx'

export default function Update({
  onClick,
  active,
  type = 'button',
  etag = '',
  modelApi = '',
  itemApi = '',
  name = 'item',
  arrays = [],
  onDone,
}) {
  const label = name.charAt(0).toUpperCase() + name.slice(1)

  if (type === 'content') {
    return (
      <div className="popup-panel">
        <h2>Update {name}</h2>
        <UpdateForm
          modelApi={modelApi}
          itemApi={itemApi}
          etag={etag}
          arrays={arrays}
          okText={`Successfully updated ${name}.`}
          name={name}
          onDone={onDone}
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      className={`action-btn danger ${active ? 'is-active' : ''}`}
      onClick={onClick}
    >
      Update {label}
    </button>
  )
}
