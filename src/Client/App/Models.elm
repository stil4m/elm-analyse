module Client.App.Models exposing (..)

import Client.DashBoard.DashBoard as DashBoard


type Msg
    = DashBoardMsg DashBoard.Msg
    | Refresh


type Content
    = DashBoardContent DashBoard.Model
