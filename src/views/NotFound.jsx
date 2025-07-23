function NotFound({ message }) {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>{message || 'The page you\'re looking for doesn\'t exist.'}</p>
    </div>
  )
}

export default NotFound 