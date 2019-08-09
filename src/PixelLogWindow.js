import React from 'react';
import Badge from '@material-ui/core/Badge';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Card from '@material-ui/core/Card';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const style = {
      flexGrow: 1,
      maxWidth: 500,
  };

const PixelLogWindow = (props) => (
    
    <Paper square style={style}>
       <AppBar position="static" color="default">
       <Toolbar>
          <Typography variant="h6" color="inherit">
            Logs
            <Badge badgeContent={props.logs.length} color="secondary" />
          </Typography>
        </Toolbar>
       </AppBar>
      { props.logs.slice().reverse().map((log)=>{
            return <Card>
                <Button id="{log}" variant="contained" target="_blank" href={`https://www.google.com/search?q=${log}`} >{log}
      </Button>
            </Card>
      }) }
    </Paper>
  );

export default PixelLogWindow;