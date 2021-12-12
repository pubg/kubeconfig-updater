import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import EditIcon from '@mui/icons-material/Edit'
import InfoIcon from '@mui/icons-material/Info'
import SettingsIcon from '@mui/icons-material/Settings'
import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <List>
      <ListItem>
        <ListItemButton component={Link} to="/cluster-management">
          <ListItemIcon>
            <ManageSearchIcon />
          </ListItemIcon>
          <ListItemText primary="Cluster Management" />
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary="KubeConfig Setting" />
        </ListItemButton>
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemButton>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Configuration" />
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText primary="Information" />
        </ListItemButton>
      </ListItem>
    </List>
  )
}
