import React from "react";
import { FaQuoteRight, FaQuoteLeft } from "react-icons/fa";
import SearchIcon from "@material-ui/icons/Search";
import { BsChatQuoteFill } from "react-icons/bs";
import { LinkContainer } from "react-router-bootstrap";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Badge from "@material-ui/core/Badge";
import InputBase from "@material-ui/core/InputBase";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import ChatIcon from "@material-ui/icons/Chat";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme, fade } from "@material-ui/core/styles";
import { getLoggedUser, Logout } from "../ReduxStore/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Row, Col } from "react-bootstrap";
import socketClient from "socket.io-client";

import $ from "jquery";

let socket;

$(function () {
  // setTimeout(()=>$("#quote-logo").animate({marginLeft : '50%'}),800 );
  setTimeout(() => $("#quote-logo").animate({ marginLeft: "5px" }), 1200);
  setTimeout(() => {
    $("#quote-logo").css("transform", "rotateZ(5deg)");
  }, 2400);
  setTimeout(() => {
    $("#quote-logo").css("transform", "rotateZ(0deg)");
  }, 2700);
});

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  search: {
    float: "right",
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.25),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.35),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    marginTop: "1%",
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },

  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  root: {
    display: "flex",
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function ResponsiveDrawer(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { loggedUser, loggedIn } = useSelector((state) => state.userStore);
  const [search, setSearch] = React.useState("");

  const hist = useHistory();

  React.useEffect(() => {
    const getInfo = async () => {
      const result = await dispatch(getLoggedUser());
      // console.log("logged in ", result);
      if (result) {
        // socket = socketClient("http://localhost:8000/"); // development mode
        socket = socketClient("https://thequoteblog.onrender.com/", {
          transports: ["websocket"],
        });
        socket.emit("useronline", result);
      }
    };
    getInfo();
  }, [dispatch, loggedIn]);

  async function getLoggedOut() {
    await dispatch(Logout(hist, loggedUser._id));
  }

  const handleSearch = (search) => {
    hist.push(`/search/${search}`);
  };

  const { window } = props;
  const theme = useTheme();
  const [openbar, setOpenbar] = React.useState(false);

  const drawer = (
    <div
      className="m-0 p-0"
      style={{
        background: "rgba(0,0,0,0.450)",
        color: "white",
        height: "100%",
      }}
    >
      {loggedUser &&
      loggedUser.profilePicture &&
      loggedUser.profilePicture.imageURL ? (
        <img
          src={loggedUser.profilePicture.imageURL}
          alt="dp"
          width="100%"
          height="25%"
          style={{ filter: "grayscale(100%)" }}
        />
      ) : (
        <img
          src="https://images.unsplash.com/photo-1542550371427-311e1b0427cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8MTV8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=400&q=60"
          alt="alternate-dp"
          width="100%"
          height="25%"
          style={{ filter: "grayscale(100%)" }}
        />
      )}

      <List className="mt-0 pt-0">
        {loggedIn && (
          <>
            <LinkContainer to="/">
              <ListItem button key={"Home"} onClick={() => setOpenbar(false)}>
                <ListItemIcon>
                  <BsChatQuoteFill
                    style={{ fontSize: "150%", color: "#971243" }}
                  />
                </ListItemIcon>
                <ListItemText primary={"Home"} />
              </ListItem>
            </LinkContainer>
            <Divider />
            <LinkContainer to="/profile">
              <ListItem
                button
                key={"Profile"}
                onClick={() => setOpenbar(false)}
              >
                <ListItemIcon>
                  <AccountCircleIcon style={{ color: "#971243" }} />
                </ListItemIcon>
                <ListItemText primary={loggedUser.username} />
              </ListItem>
            </LinkContainer>
            <Divider />
            <LinkContainer to="/notifications">
              <ListItem
                button
                key={"Notifications"}
                onClick={() => setOpenbar(false)}
              >
                <ListItemIcon>
                  <Badge
                    badgeContent={loggedUser.notifications.unread}
                    color="secondary"
                  >
                    <NotificationsActiveIcon style={{ color: "#971243" }} />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary={"Notifications"} />
              </ListItem>
            </LinkContainer>
            <Divider />
            <LinkContainer to="/chatting">
              <ListItem
                button
                key={"Messages"}
                onClick={() => setOpenbar(false)}
              >
                <ListItemIcon>
                  <ChatIcon style={{ color: "#971243" }} />
                </ListItemIcon>
                <ListItemText primary={"Messages"} />
              </ListItem>
            </LinkContainer>
            <Divider />

            <LinkContainer to="/login">
              <ListItem
                button
                key={"Logout"}
                onClick={() => {
                  setOpenbar(false);
                  getLoggedOut();
                }}
              >
                <ListItemIcon>
                  <ExitToAppIcon style={{ color: "#971243" }} />
                </ListItemIcon>
                <ListItemText primary={"Logout"} />
              </ListItem>
            </LinkContainer>
            <Divider />
          </>
        )}

        {!loggedIn && (
          <>
            <LinkContainer to="/login">
              <ListItem button key={"Login"} onClick={() => setOpenbar(false)}>
                <ListItemIcon>
                  <VpnKeyIcon />
                </ListItemIcon>
                <ListItemText primary={"Login"} />
              </ListItem>
            </LinkContainer>
            <Divider />
            <LinkContainer to="/signup">
              <ListItem button key={"Signup"} onClick={() => setOpenbar(false)}>
                <ListItemIcon>
                  <PersonAddIcon />
                </ListItemIcon>
                <ListItemText primary={"Signup"} />
              </ListItem>
            </LinkContainer>
            <Divider />
          </>
        )}
      </List>
      <Divider />
      <List></List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="sticky"
        className={classes.appBar}
        style={{ height: "8vh", borderBottom: "1px solid yellow" }}
      >
        <Toolbar style={{ backgroundColor: "#971243" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setOpenbar(!openbar)}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Row>
            <Col>
              <Typography variant="h6" noWrap id="quote-logo">
                <div
                  style={{ cursor: "pointer", color: "white" }}
                  onClick={() => hist.push("/")}
                >
                  <div id="logo-text">
                    <FaQuoteLeft /> The Quote <BsChatQuoteFill />{" "}
                    <FaQuoteRight />
                  </div>
                </div>
              </Typography>
            </Col>
            {loggedIn && (
              <Col>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="find friends..."
                    onKeyDown={(e) =>
                      search.length &&
                      e.key === "Enter" &&
                      handleSearch(e.target.value)
                    }
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                    inputProps={{ "aria-label": "search" }}
                  />
                </div>
              </Col>
            )}
          </Row>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={openbar}
            onClose={() => setOpenbar(false)}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="temporary"
            open={openbar}
            onClose={() => setOpenbar(false)}
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
