import { Typography, Switch } from '@mui/material';
interface AccessSwitchProps {
  fullAccess: boolean;
  handleToggleFullAccess: (event: React.ChangeEvent<HTMLInputElement>) => void;
  customFontStyle?: object;
}
const CustomSwitch = ({
  fullAccess,
  handleToggleFullAccess,
  customFontStyle,
}: AccessSwitchProps) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Typography sx={customFontStyle}>All</Typography>
      <Switch
        checked={fullAccess}
        onChange={handleToggleFullAccess}
        sx={{
          padding: 0,
          width: 42,
          height: 26,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            transitionDuration: '300ms',
            '&.Mui-checked': {
              transform: 'translateX(16px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                border: 0,
                background:
                  'linear-gradient(271.8deg, #E68907 1.15%, #FFBD0D 78.68%)',
                opacity: 1,
              },
              '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: '#33cf4d',
                border: '6px solid #fff',
              },
              '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
              },
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
              color: '#BDBDBD',
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              background: '#BDBDBD',
              opacity: 0.5,
            },
          },
          '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            opacity: 1,
            background: fullAccess
              ? 'linear-gradient(271.8deg, #E68907 1.15%, #FFBD0D 78.68%)'
              : '#BDBDBD',
          },
          '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 25,
            height: 25,
          },
        }}
      />
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: fullAccess ? '600' : '400',
          color: fullAccess ? '#000000' : '#9E9E9E',
        }}
      >
        Only Full Access
      </Typography>
    </div>
  );
};

export default CustomSwitch;
