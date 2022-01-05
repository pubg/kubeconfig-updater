import { List, ListItem, ListItemButton } from '@mui/material'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'
import InfoIcon from '@mui/icons-material/Info'
import SettingsIcon from '@mui/icons-material/Settings'
import RuleIcon from '@mui/icons-material/Rule'
import { Link } from 'react-router-dom'

export default function Sidebar() {
  return (
    <List>
      <ListItem>
        <ListItemButton component={Link} to="/cluster-management">
          <ManageSearchIcon />
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton component={Link} to="/credentials-resolver">
          <RuleIcon />
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton component={Link} to="/configuration">
          <SettingsIcon />
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton component={Link} to="/about">
          <InfoIcon />
        </ListItemButton>
      </ListItem>
    </List>
  )
}
