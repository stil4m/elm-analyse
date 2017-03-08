module Client.App.Models
    exposing
        ( Msg(DashBoardMsg, GraphMsg, Refresh, OnLocation, FileTreeMsg)
        , Model
        , Content(DashBoardContent, GraphContent, FileTreeContent)
        )

import Client.DashBoard.DashBoard as DashBoard
import Client.Graph.Graph as Graph
import Client.FileTree as FileTree
import Navigation exposing (Location)


type Msg
    = DashBoardMsg DashBoard.Msg
    | GraphMsg Graph.Msg
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
    | GraphContent Graph.Model
