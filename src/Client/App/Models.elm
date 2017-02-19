module Client.App.Models
    exposing
        ( Msg(DashBoardMsg, Refresh, OnLocation, FileTreeMsg)
        , Model
        , Content(DashBoardContent, FileTreeContent)
        )

import Client.DashBoard.DashBoard as DashBoard
import Client.FileTree as FileTree
import Navigation exposing (Location)


type Msg
    = DashBoardMsg DashBoard.Msg
    | FileTreeMsg FileTree.Msg
    | Refresh
    | OnLocation Location


type alias Model =
    { location : Location
    , content : Content
    }


type Content
    = DashBoardContent DashBoard.Model
    | FileTreeContent FileTree.Model
