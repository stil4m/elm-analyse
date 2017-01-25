module Interfaces.Dependencies exposing (..)

import AST.Types as AST


find : AST.File -> List AST.ModuleName
find file =
    file.imports
        |> List.map .moduleName
