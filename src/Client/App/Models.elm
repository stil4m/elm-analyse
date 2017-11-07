module Client.App.Models
    exposing
        ( Content(DashboardContent, DependenciesPageContent, FileTreeContent, GraphContent, MessagesPageContent, NotFound, PackageDependenciesContent)
        , Model
        , ModuleGraphPageMsg
        , Msg(DashboardMsg, DependenciesPageMsg, FileTreeMsg, GraphMsg, MessagesPageMsg, OnLocation, PackageDependenciesMsg, Refresh)
        , PackageDependenciesPage
        , PackageDependenciesPageMsg
        , moduleGraphPage
        , packageDependenciesPage
        )

import Client.Components.FileTree as FileTree
import Client.Dashboard as Dashboard
import Client.DependenciesPage as DependenciesPage
import Client.Graph.Graph as Graph
import Client.Graph.PackageDependencies as PackageDependencies
import Client.MessagesPage as MessagesPage
import Client.StaticStatePage as StaticStatePage
import Navigation exposing (Location)


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
    StaticStatePage.Model Graph.Model ()


type alias ModuleGraphPageMsg =
    StaticStatePage.Msg ()


moduleGraphPage : ( ModuleGraphPage, Cmd ModuleGraphPageMsg )
moduleGraphPage =
    StaticStatePage.init
        { view = Graph.view
        , update = \() model -> ( model, Cmd.none )
        , init = Graph.init
        }


type Msg
    = MessagesPageMsg MessagesPage.Msg
    | DashboardMsg Dashboard.Msg
    | DependenciesPageMsg DependenciesPage.Msg
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
    = MessagesPageContent MessagesPage.Model
    | DashboardContent Dashboard.Model
    | DependenciesPageContent DependenciesPage.Model
    | FileTreeContent FileTree.Model
    | GraphContent ModuleGraphPage
    | PackageDependenciesContent PackageDependenciesPage
    | NotFound
