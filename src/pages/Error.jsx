export default function Error({ errorCode, message = '' }) {
  return (
    <div className="status-message">
      <div>
        <h1>Error: {errorCode}</h1>
        {message && <p>{message}</p>}
      </div>
    </div>
  )
}
