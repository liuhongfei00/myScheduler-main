import React, { Component } from "react";
import fetchTasks from "./AddTask";
import Modal from "react-modal";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Button,
} from "@material-ui/core";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { purple } from "@mui/material/colors";

import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator,
} from "@daypilot/daypilot-lite-react";
import { Link } from "react-router-dom";

import axios from "axios";
import { saveAs } from "file-saver";
import Timer from "./Timer";
import { create } from "string-table";

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: purple[500],
    },
    secondary: {
      // This is green.A700 as hex.
      main: "#11cb5f",
    },
  },
});

//import AddBlocker from "./AddBlocker";

const styles = {
  wrap: {
    display: "flex",
  },
  left: {
    marginRight: "10px",
  },
  main: {
    flexGrow: "1",
  },
  pad: {
    padding: 20,
  },
};

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.calendarRef = React.createRef();
    this.state = {
      showGeneratedMessage: false,
      isModalOpen: false,
      taskName: "",
      blockers: [],
      workSessions: [],
      viewType: "Week",
      durationBarVisible: false,
      timeRangeSelectedHandling: "Enabled",
      onTimeRangeSelected: async (args) => {
        console.log("Sending blocker(s) to the backend");
        let startTotal = new Date(args.start.value);
        let endTotal = new Date(args.end.value);
        let numBlockers = (endTotal - startTotal) / 1800000;
        const token = localStorage.getItem("token");
        const blockerData = {
          token,
          time: startTotal.toISOString(), // Convert the date to ISO string format
          number: numBlockers,
        };
        try {
          // Call the backend endpoint with the prepared data
          const response = await axios.post(
            "/api/blocker/addMultiple",
            blockerData
          );
          //console.log("multiple blockers: ", response.data);
        } catch (error) {
          console.error("Error adding multiple blockers:", error);

          let errorMessage =
            "An error occurred while adding multiple blockers.";
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            errorMessage = error.response.data.error;
          }

          throw new Error(errorMessage);
        }
        const dp = this.calendar;
        dp.update();
        const selectedStartOfWeek = this.getStartOfWeek(args.start.value);
        const selectedEndOfWeek = new Date(selectedStartOfWeek);
        //console.log("selectedStartOfWeek:", selectedStartOfWeek);
        //console.log("selectedEndOfWeek:", selectedEndOfWeek);
        selectedEndOfWeek.setDate(selectedEndOfWeek.getDate() + 7);
        await this.updateCalendar(
          selectedStartOfWeek.toISOString(),
          selectedEndOfWeek.toISOString()
        );
      },

      eventDeleteHandling: "Update",
      onEventClick: async (args) => {
        console.log(args.e.data.text);
        let name = args.e.data.text;

        const currentWeekWorkSessions = this.filterCurrentWeekWorkSessions(
          this.state.workSessions,
          new Date(args.e.data.start),
          new Date(args.e.data.end)
        );

        console.log(currentWeekWorkSessions[0]);
        if (currentWeekWorkSessions.length != 0) {
          const response = await axios.get(`/api/task/getById/${currentWeekWorkSessions[0].taskId}`);
          const task = response.data.task;
          console.log(task);
          let date = new Date(task.dueDate);
          console.log(date);
          DayPilot.Modal.alert("The task \'" + task.name +
            "\' (Description: " + task.description +
            ") is due on " + date);
        }
      },
      onBeforeCellRender: (args) => {
        // console.log("cell");
        // console.log(args);
        args.cell.backColor = "#eeeeee";
        args.cell.disabled = false;
        // let blockers = this.state.blockers;
        // console.log("blockers:")
        // console.log(blockers);
        let blockers = this.state.blockers;
        if (blockers) {
          for (let i = 0; i < blockers.length; i++) {
            if (
              args.cell.start >= blockers[i].start &&
              args.cell.end <= blockers[i].end
            ) {
              //args.cell.backColor = "#aba9a9";
              // args.cell.disabled = true;
              args.cell.backColor = "#808080";
              args.cell.fontColor = "white";
              break;
            }
          }
        }
      },

      date: "",
      // added date for the title
    };
  }

  get calendar() {
    return this.calendarRef.current.control;
  }

  getDate() {
    this.setState({
      date: new Date().toDateString(),
    });
  }

  onEventDelete = async (args) => {
    if (!window.confirm("Are you sure you want to delete this blocker?")) {
      return;
    }

    const blockerStartTime = args.e.start().toString();

    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `/api/blocker/delete/${token}/${blockerStartTime}`
      );
      console.log("delete response:", response.data);

      const dp = this.calendar;
      dp.events.remove(args.e);
      dp.update();
    } catch (error) {
      console.error("Error deleting blocker:", error);

      let errorMessage = "An error occurred while deleting the blocker.";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }

      alert(errorMessage);
    }
  };

  async componentDidMount() {
    //this.updateCalendar();
    this.getDate();
    const startOfWeek = this.getStartOfWeek(new Date());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    await this.updateCalendar(
      startOfWeek.toISOString(),
      endOfWeek.toISOString()
    );
  }

  async updateCalendar(startTime, endTime) {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `/api/blockers/getBetweenTimes/${token}/${startTime}/${endTime}`
      );

      //console.log("blocker between time:", response.data);
      const blockers = response.data.blockers.map((blocker) => ({
        start: new Date(blocker.time).getTime(),
        end: new Date(blocker.time).getTime() + blocker.duration * 60000,
        backColor: "#808080",
      }));
      //stringToColour(blocker.name)
      const currentWeekWorkSessions = this.filterCurrentWeekWorkSessions(
        this.state.workSessions,
        startTime,
        endTime
      );
      const calendarWorkSessions = this.transformWorkSessionsToEvents(
        currentWeekWorkSessions
      );
      console.log("calendarWorkSession: ", calendarWorkSessions);

      // Combine blockers and work sessions
      const combinedEvents = [...blockers, ...calendarWorkSessions];

      // Update calendar events
      this.calendar.events.list = combinedEvents;
      this.calendar.update();
    } catch (error) {
      console.error("Error updating calendar:", error);

      let errorMessage = "An error occurred while updating the calendar.";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }

      throw new Error(errorMessage);
    }
  }

  getStartOfWeek(date) {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - dayOfWeek;
    startOfWeek.setDate(diff);
    return startOfWeek;
  }

  onBeforeEventRender(args) {
    console.log("button removed");
    args.data.backColor = args.data.backColor || "#f9f9f9";
    args.data.deleteMargin = -1000; // Set a large negative value to move the delete button out of view
  }

  exportReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/blockers/getAll/${token}`);
      const blockers = response.data.blockers;
      var tasks = [];
      var report = "Productivity Report\n\n";

      //TODO: after merging with final task model, remove blockers and format
      //(remove ids, __V, user info...)

      // blockers.forEach(function (blocker) {
      //   if (hero.hasOwnProperty('task')) {
      //     const displayTask = {

      //     };

      //   }
      // });

      // report += create(tasks);
      report += create(blockers);

      var blob = new Blob([report], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, "productivity report.txt");
    } catch (error) {
      console.error(error);
    }
  };

  exportDay = async (date) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/blockers/getAll/${token}`);
      const blockers = response.data.blockers;
      const todayTask = [];
      var report = "Daily Log\n\n";
      const today = new Date();

      blockers.forEach((b) => {
        if (today.toISOString().substring(0, 10) === b.time.substring(0, 10)) {
          todayTask.push(b);
        }
      });

      if (todayTask.length == 0) {
        report += "nothing planned for today";
      } else {
        report += create(todayTask);
      }

      var blob = new Blob([report], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "Daily Log.txt");
    } catch (error) {
      console.error(error);
    }
  };

  exportTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/api/task/getAll/${token}`);

      console.log(JSON.stringify(response.data.tasks));
      var blob = new Blob([JSON.stringify(response.data.tasks)], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, "tasks.txt");
    } catch (error) {
      console.error(error);
    }
  };

  //     // console.log(tasks);
  //     console.log('{"name":"John", "age":30, "city":"New York"}'.json);

  //     const taskId = "";
  // 		const dueDate = "";
  // 		const lengthOfWork = "";
  //     const priorityValue = "";
  //     const categoryValue = "";
  //     const name = "";
  //     const description = "";

  //     const response = await axios.post("/api/blockers/add", {
  //       taskId,
  // 		  dueDate,
  // 		  lengthOfWork,
  // 		  priorityValue,
  // 		  token,
  // 		  categoryValue,
  // 		  name,
  // 		  description,
  //     });

  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  componentDidMount() {
    //this.updateCalendar();
    this.getDate();
  }
  async generateSchedule() {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`/api/task/getAllWorkSessions/${token}`);
      const allWorkSessions = response.data;
      console.log("allWorkSessions: ", allWorkSessions);
      const earliestStartDate = this.getEarliestDate(allWorkSessions);
      this.setState({ workSessions: allWorkSessions, earliestStartDate });
      this.toggleGeneratedMessage();
    } catch (error) {
      console.error("Error generating schedule:", error);
      let errorMessage = "An error occurred while generating the schedule.";
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      throw new Error(errorMessage);
    }
  }

  filterCurrentWeekWorkSessions(workSessions, startTime, endTime) {
    return workSessions.filter(
      (workSession) =>
        new Date(workSession.start) >= new Date(startTime) &&
        new Date(workSession.end) <= new Date(endTime)
    );
  }

  transformWorkSessionsToEvents(workSessions) {
    return workSessions.map((workSession) => {
      let startDate = new Date(workSession.start);
      let endDate = new Date(workSession.end);
      startDate = new Date(startDate.getTime() - 60000 * 240);
      endDate = new Date(endDate.getTime() - 60000 * 240);
      const color = this.generateColorFromString(workSession.task);
      //console.log("work session: ", workSession);
      return {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        text: workSession.task,
        backColor: color, // Add the color property
      };
    });
  }

  toggleGeneratedMessage() {
    this.setState({ showGeneratedMessage: true }, () => {
      setTimeout(() => {
        this.setState({ showGeneratedMessage: false });
      }, 2000);
    });
  }

  getStartOfWeek(date) {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - (dayOfWeek === 0 ? 0 : dayOfWeek);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);
    //console.log("start of week:", startOfWeek);
    return startOfWeek;
  }

  generateColorFromString(str) {
    var copy = str;
    for (var i = 0; i < 20; i++) {
      let length = copy.length;
      for (var a = 0; a < length; a++) {
        str = str.concat(copy[a]);
      }
    }

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }
    return color;
  }

  getEarliestDate(workSessions) {
    let earliestDate = new Date(workSessions[0].start);

    workSessions.forEach((workSession) => {
      const currentDate = new Date(workSession.start);

      if (currentDate < earliestDate) {
        earliestDate = currentDate;
      }
    });

    return earliestDate;
  }

  render() {
    const currentDate = new Date();
    const startOfWeek = this.getStartOfWeek(currentDate)
      .toISOString()
      .slice(0, 10);
    return (
      <div style={styles.flex}>
        <div class="mom">
          <div class="child">
            <img
              src="https://i.postimg.cc/BnMz9cYk/logo2.png"
              alt="Logo"
              width="200"
            ></img>
          </div>
          <div class="child">
            <h1>
              {" "}
              <center> {this.state.date} </center>
            </h1>
          </div>
        </div>
        <div style={styles.wrap}>
          <div style={styles.left}>
            <DayPilotNavigator
              selectMode={"week"}
              showMonths={1}
              skipMonths={1}
              startDate={startOfWeek}
              selectionDay={startOfWeek}
              //weekStarts={"Sunday"} // Add this line to start the week on Sundays
              onTimeRangeSelected={async (args) => {
                const selectedStartOfWeek = this.getStartOfWeek(args.day);
                const selectedEndOfWeek = new Date(selectedStartOfWeek);
                selectedEndOfWeek.setDate(selectedEndOfWeek.getDate() + 7);

                await this.updateCalendar(
                  selectedStartOfWeek.toISOString(),
                  selectedEndOfWeek.toISOString()
                );

                this.calendar.update({
                  startDate: args.day,
                });
              }}
            />
            <div style={styles.pad}>
              <center>
                <Button color="primary" variant="outlined" onClick={this.exportTasks}>
                  Export Tasks
                </Button>
                <div class="note"></div>
                <Button color="primary" variant="outlined" onClick={this.exportReport}>
                  Get Productivity Report
                </Button>
                <div class="note"></div>
                <Button color="primary" variant="outlined" onClick={this.exportDay}>
                  Daily Log
                </Button>
                <div class="note"></div>
                {/* <button type="button" onClick={this.importTasks}>
                  Import Tasks
                </button> */}
              </center>
            </div>
            <Timer />
          </div>
          <div style={styles.main}>
            <ThemeProvider theme={theme}>
              <Link to="/tasklist">
                <Button color="primary" variant="outlined">
                  Go to Task List
                </Button>
              </Link>
              &nbsp;
              <Button
                color="secondary"
                variant="outlined"
                onClick={() => this.generateSchedule()}
              >
                Generate Schedule
              </Button>
            </ThemeProvider>
            {this.state.showGeneratedMessage && (
              <span style={{ marginLeft: "10px", color: "green" }}>
                Schedule is generated! Start work on{" "}
                {this.state.earliestStartDate.toLocaleDateString()}
              </span>
            )}
            <div class="space">&nbsp;</div>
            <DayPilotCalendar
              {...this.state}
              ref={this.calendarRef}
              onBeforeEventRender={this.onBeforeEventRender}
              onEventDelete={this.onEventDelete}
            />
          </div>
        </div >
      </div >
    );
  }
}

export default Calendar;
