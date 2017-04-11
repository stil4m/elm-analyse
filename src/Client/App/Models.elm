module Client.App.Models
    exposing
        ( Msg(DashBoardMsg, GraphMsg, Refresh, OnLocation, FileTreeMsg, PackageDependenciesMsg)
        , Model
        , Content(DashBoardContent, GraphContent, FileTreeContent, PackageDependenciesContent)
        , PackageDependenciesPage
        , PackageDependenciesPageMsg
        , packageDependenciesPage
        , ModuleGraphPageMsg
        , moduleGraphPage
        )

import Client.DashBoard.DashBoard as DashBoard
import Client.Graph.Graph as Graph
import Client.Graph.PackageDependencies as PackageDependencies
import Client.FileTree as FileTree
import Navigation exposing (Location)
import Client.StaticStatePage as StaticStatePage exposing (StaticPage)


type alias PackageDependenciesPage =
    StaticStatePage.Model PackageDependencies.Model PackageDependencies.Msg


type alias PackageDependenciesPageMsg =
    StaticStatePage.Msg PackageDependencies.Msg


packageDependenciesPage : ( PackageDependenciesPage, Cmd PackageDependenciesPageMsg )
packageDependenciesPage =
    StaticStatePage.init
        { view = PackageDependencies.view
        , update = PackageDependencies.update
        , init = PackageDependencies.init
        }


type alias ModuleGraphPage =
    StaticStatePage.Model Graph.Model Graph.Msg


type alias ModuleGraphPageMsg =
    StaticStatePage.Msg Graph.Msg


moduleGraphPage : ( ModuleGraphPage, Cmd ModuleGraphPageMsg )
moduleGraphPage =
    StaticStatePage.init
        { view = Graph.view
        , update = Graph.update
        , init = Graph.init
        }


type Msg
    = DashBoardMsg DashBoard.Msg
    | GraphMsg ModuleGraphPageMsg
    | FileTreeMsg FileTree.Msg
    | PackageDependenciesMsg PackageDependenciesPageMsg
    | Refresh
    | OnLocation Location


type alias Model =
    { location : Location
    , content : Content
    }


type Content
    = DashBoardContent DashBoard.Model
    | FileTreeContent FileTree.Model
    | GraphContent ModuleGraphPage
    | PackageDependenciesContent PackageDependenciesPage
