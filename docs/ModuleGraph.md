# Module Graph

## Graph

The graph shows you all modules in your code base. Each dot represent one
module. Mouseover a module to reveal its name or zoom in to view more labels.

The color of each dot is determined by the module's namespace. The first
component of each module's name determines the color: e.g. Module `A.1` and
`A.2` will receive one color, `B.1` another.

The size of each module is determine by the number of in- and outbound
connections (i.e. how often it is imported and how many module it imports).

You can click a module to highlight only the modules direcly related to it.
Click a module's namespace in the legend to limit the graph (and table below) to
include only modules of that namespace and their internal relation.


## Top importees and importers

The list of top importees and importers shows you the modules in the analysed
code base that import the most modules and that are imported the most.

Reducing the centrality of individual modules can be beneficial for a few
reasons:

* It makes individual modules more re-usable by requiring fewer imports
* It speeds up development as it can reduce the compile time as fewer modules
  will be affected by changes.
* It groups related functions together and makes them easier to understand
  and read.

### Top importees

A list of modules being imported the most. These modules are the most "popular"
in your code base. This might be the result of modules taking up too many
responsibilites. To reduce the number of imports of a specific module you may:

* Split type definitions and function operating with these into separate modules
* Separate related functions into sub-modules to allow callsites to import only
  the most appropriate part of the code.

### Top importers

Typical candidates are your app's update function. These usually import many
sub modules. These modules tend to become very powerful. Again you can try to
reduce the number of imports by trying to delegate function subroutines to
separate modules. This makes sense if individual functions are responsible for
multiple imports.
