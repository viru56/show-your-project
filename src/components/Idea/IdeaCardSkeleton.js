import React from "react";
import { makeStyles,Card,CardHeader ,CardContent} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles(theme => ({
  card: {
    width: 350,
    margin: theme.spacing(1)
  },
  header: {
    padding: 0
  },
  media: {
    height: 200
  },
  name:{
    display: 'flex',
    justifyContent: 'space-between',
    marginTop:20,
    marginBottom:10
  }
}));

/* idea card skeleton */
export default function ProfileCardSkeleton() {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <Skeleton animation="wave" variant="rect" className={classes.media} />
      <CardContent style={{paddingBottom:0}}>
        <CardHeader
          className={classes.header}
          action={<Skeleton animation="wave" width={40} height={20} />}
          title={
            <Skeleton
              animation="wave"
              height={20}
              width="80%"
              style={{ marginBottom: 6 }}
            />
          }
        />
        <React.Fragment>
          <Skeleton animation="wave" height={20} />
          <Skeleton animation="wave" height={20} />
          <Skeleton animation="wave" height={20} />
          <Skeleton animation="wave" height={20} />
          <Skeleton animation="wave" height={20} />
          <div className={classes.name}>
          <Skeleton animation="wave" height={20} width="40%" />
          <Skeleton animation="wave" height={20} width="20%" />
          </div>
          <Skeleton animation="wave" height={20} width="40%" />
          <div style={{display:"flex",justifyContent:"space-between"}}>
          <Skeleton animation="wave" height={10} width="20%" />
          <Skeleton animation="wave" height={10} width="20%" />
          <Skeleton animation="wave" height={10} width="20%" />
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
          <Skeleton animation="wave" height={10} width="20%" />
          <Skeleton animation="wave" height={10} width="20%" />
          <Skeleton animation="wave" height={10} width="20%" />
          </div>
        <Skeleton animation="wave" height={40} style={{marginTop:20}} />
        </React.Fragment>
      </CardContent>
    </Card>
  );
}
