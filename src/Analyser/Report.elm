module Analyser.Report exposing (Report, encode)

import Analyser.Messages.Json
import Analyser.Messages.Types exposing (Message)
import Analyser.Modules
import Json.Encode as JE exposing (Value)


type alias Report =
    { messages : List Message
    , modules : Analyser.Modules.Modules
    , unusedDependencies : List String
    }


encode : Report -> Value
encode r =
    JE.object
        [ ( "messages", JE.list Analyser.Messages.Json.encodeMessage r.messages )
        , ( "modules", Analyser.Modules.encode r.modules )
        , ( "unusedDependencies", JE.list JE.string r.unusedDependencies )
        ]
