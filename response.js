export const response = (status, values, res, message) => {
  const data = {
    'status': status,
    'value': values
  }
  if (message) res.statusMessage = message
  res.status(data.status)
  res.json(data)
  res.end()
}