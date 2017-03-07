module Client.App.Models
    exposing
        ( Msg(DashBoardMsg, DependencyGraphMsg, Refresh, OnLocation, FileTreeMsg)
        , Model
        , Content(DashBoardContent, DependencyGraphContent, FileTreeContent)
        )

import Client.DashBoard.DashBoard as DashBoard
import Client.DependencyGraph.DependencyGraph as DependencyGraph
import Client.FileTree as FileTree
import Navigation exposing (Location)


type Msg
    = DashBoardMsg DashBoard.Msg
    | DependencyGraphMsg DependencyGraph.Msg
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
    | DependencyGraphContent DependencyGraph.Model
