import { Modal, Box, Button, Typography } from '@mui/material'

const ViewSettingsModal = ({ open, onClose, onSave, onLoad }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 1 }}>
        <Typography variant='h6'>Save or Load View Settings</Typography>
        <Button onClick={onSave}>Save Current View</Button>
        <Button onClick={onLoad}>Load View</Button>
      </Box>
    </Modal>
  )
}

export default ViewSettingsModal
