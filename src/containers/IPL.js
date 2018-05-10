import React from 'react';
import {
  BootstrapTable,
  TableHeaderColumn
} from 'react-bootstrap-table';
import '../css/Table.css';
import '../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css';
import request from 'request';
import { players } from './players';
import { score } from './score';
import { talenticaPlayers } from './talenticaPlayers';

export default class IPL extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playersProfile: {},
      matchData: {},
      talenticaPlayersData: {}
    };
  }

  componentWillMount() {
    this.playersTransformation();
    // this.loadPlayers();
  }

  playersTransformation = () => {
    const pt = {};
    players.players.forEach((player) => {
      pt[player.player_id] = {
        id: player.player_id,
        name: player.short_name
      };
    });
    this.setState({
      playersProfile: pt
    }, () => this.loadPlayers());
  }

  loadPlayers = () => {
    // request.get({
    //   url: 'https://s3-us-west-2.amazonaws.com/fanlive/h2h-live/event_pp_2989.json?v=1525888783913'
    // }, (err, response) => {
    //   console.log(response);
    //   this.setState({
    //     matchData: this.updateData(JSON.parse(response.body))
    //   });
    // });
    const { newData, talenticaPlayersData } = this.updateData(score);
    this.setState({
      matchData: newData,
      talenticaPlayersData
    });
  }

  updateData = (newData) => {
    const pt = JSON.parse(JSON.stringify(this.state.playersProfile));
    const tp = JSON.parse(JSON.stringify(this.state.talenticaPlayersData));
    console.log(pt);
    newData.pps.forEach((player) => {
      player.name = pt[player.player_id].name;
      talenticaPlayers.forEach((tP) => {
        const index = tP.players.filter((p) => p.id === player.player_id);
        if (index.length > 0) {
          player[tP.name] = player.batting_pts + player.bowling_pts + player.fielding_pts + player.bonus_pts;
          if (index[0].boPP) {
            player[tP.name] += player.bowling_pts;
          }
          if (index[0].bPP) {
            player[tP.name] += player.batting_pts;
          }
          if (typeof tp[tP.name] === 'undefined') {
            tp[tP.name] = 0;
          }
          tp[tP.name] += player[tP.name];
        }
      });
    });
    let talenticaPlayersData = [];
    Object.keys(tp).forEach((p) => {
      talenticaPlayersData.push({
        name: p,
        value: tp[p]
      });
    });
    return { newData, talenticaPlayersData };
  }

  render() {
    if (this.state.matchData.match_status) {
      return (
        <div>
          <BootstrapTable data={this.state.talenticaPlayersData}>
            <TableHeaderColumn isKey dataField='name'>
              ID
          </TableHeaderColumn>
            <TableHeaderColumn dataField='value'>
              SCORE
          </TableHeaderColumn>
          </BootstrapTable>


          <BootstrapTable data={this.state.matchData.pps}>
            <TableHeaderColumn isKey dataField='player_id'>
              ID
          </TableHeaderColumn>
            <TableHeaderColumn dataField='name'>
              NAME
          </TableHeaderColumn>
            <TableHeaderColumn dataField='batting_pts'>
              Batting
          </TableHeaderColumn>
            <TableHeaderColumn dataField='bowling_pts'>
              Bowling
          </TableHeaderColumn>
            <TableHeaderColumn dataField='fielding_pts'>
              Fielding
          </TableHeaderColumn>
            <TableHeaderColumn dataField='bonus_pts'>
              Bonus
          </TableHeaderColumn>
            <TableHeaderColumn dataField='Anand'>
              Anand
          </TableHeaderColumn>
            <TableHeaderColumn dataField='Abhishek'>
              Abhishek
          </TableHeaderColumn>
            <TableHeaderColumn dataField='Ashish'>
              Ashish
          </TableHeaderColumn>
            <TableHeaderColumn dataField='Bikash'>
              Bikash
          </TableHeaderColumn>
            <TableHeaderColumn dataField='Gaurav'>
              Gaurav
          </TableHeaderColumn>
          </BootstrapTable>
        </div>
      );
    } else {
      return (
        <div>No match</div>
      );
    }

    // return this.state.playersProfile.players.forEach((player) => {
    //   <div>
    //     Hi
    //       </div>
    // });
  }
};

