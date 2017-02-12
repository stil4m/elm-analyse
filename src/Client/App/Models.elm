module Client.App.Models
    exposing
        ( Msg(DashBoardMsg, Refresh, OnLocation)
        , Model
        , Content(DashBoardContent)
        )

import Client.DashBoard.DashBoard as DashBoard
import Navigation exposing (Location)


type Msg
    = DashBoardMsg DashBoard.Msg
    | Refresh
    | OnLocation Location


type alias Model =
    { location : Location
    , content : Content
    }


type Content
    = DashBoardContent DashBoard.Model
