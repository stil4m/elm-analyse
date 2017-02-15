module Analyser.Fixes.PatternOptimizer exposing (optimize)

import AST.Types exposing (Pattern(..))
import AST.Ranges exposing (Range)


optimize : Range -> Pattern -> Pattern
optimize range pattern =
    pattern
