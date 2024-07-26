import { RecoilState, useRecoilState } from "recoil";
import { ListItem, ListItemIcon, ListItemText, Switch } from "@mui/material";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";

export function Enabled(props: { enabledState: RecoilState<boolean> }) {
  const [open, setOpen] = useRecoilState(props.enabledState);
  return (
    <ListItem>
      <ListItemIcon>
        <ElectricBoltIcon />
      </ListItemIcon>
      <ListItemText primary="Enabled" />
      <Switch
        inputProps={{ "aria-label": "controlled" }}
        checked={open}
        onChange={() => setOpen(!open)}
      />
    </ListItem>
  );
}