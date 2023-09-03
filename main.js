//Global general
var genre = {Drama:0,Adventure:1,Family:2,Animation:3,Comedy:4,Biography:5,Action:6}
let genreArr = Object.keys(genre)

var size = {height:600,
    width:1000,
    margin:{
    x:120,
    y:60
    }
    }
    let measure = (element,target) => {
    let el = d3.select(element)
    switch(true){
    case target=='height':
    return el.node().getBoundingClientRect().height
    break;
    case target=='x':
    return el.node().getBoundingClientRect().x
    break;
    case target=='y':
    return el.node().getBoundingClientRect().y
    break;
    default:
    return el.node().getBoundingClientRect().width
    break;
    }
    }
    //______________________________________________________________________________________________________________
    //render
    const renderMe = (m) =>{
    //create canvas/svg
    const svg = d3.select('.bod')
    .append('svg')
    .attr('id','svg')
    .attr('height', size.height)
    .attr('width',size.width)
    //create hierarchy
    let hier = d3.hierarchy(m,(node)=>node['children'])
    .sum(node=>node['value'])
    .sort((node1,node2)=>node2['value'] - node1['value'])

    
    let createTreeMap = d3.treemap()
    .size([size.width,size.height])//caluclate the total width and height
    
    createTreeMap(hier)
    let leaves = hier.leaves()
    console.log(leaves)
    //tiles
    let blocks = svg.selectAll('g')
    .attr('id','blocks')
    .data(leaves)
    .enter()
    .append('g')
    .style('transform',movie=>{
    return `translate(${movie.x0}px,${movie.y0}px)`
    })
    let tiles = blocks.append('rect')
    .classed('tile',true)
    .attr('fill',d=>{
    let cat = d['data']
    return ['red','blue','green','orange','purple','pink','lightBlue'][genre[`${cat.category}`]]
    })
    .attr('data-name',d=>d['data']['name'])
    .attr('data-value',d=>d['data']['value'])
    .attr('data-category',d=>d['data']['category'])
    .attr('width',movie=>movie['x1']-movie['x0'])
    .attr('height',movie=>movie['y1']-movie['y0'])
    .attr('stroke','#fff')

    let text = blocks.append('text')
    .classed('text',true)
    .attr('x',5)
    .attr('y',20)
    .html(movie=>{
    let info = movie.data
    return info.name
    })
    
    //create legend
    let legend = d3.select('body')
    .append('svg')
    .attr('id','legend')

    //rectangles for the legend
    let legendRecs = legend.selectAll('g')
                    .data(genreArr)
                    .enter()
                    .append('g')
                    .classed('legGroup',true)
                    .append('rect')
                    .classed('legend-item',true)
                    .attr('height',30)
                    .attr('width',30)
                    .attr('x', 0)
                    .attr('y',(d,i)=> i*(legend.node().getBoundingClientRect().height/genreArr.length))
                    .attr('fill',category=>{
                    return ['red','blue','green','orange','purple','pink','lightBlue'][genre[`${category}`]]
                    })
                    console.log(legendRecs)
        let legendText = d3.selectAll('.legGroup')
                                   .append('text')
                                   .attr('class','legText')
                                   .attr('x', d3.select('.legend-item').node().getBoundingClientRect().width + 20)
                                   .attr('y',(d,i)=> (i*(legend.node().getBoundingClientRect().height/genreArr.length))+20)
                                   .text(function(category){return category})
                                   .attr('fill','#fff')
                         //text for the legend          
            legendText
                    .on('mouseover',(g)=>{
                        d3.select(g.target)
                          .attr('style','fill:gold;background:black;transition: .3s ease;')
                    })
                    .on('mouseout',(g)=>{
                        d3.select(g.target)
                          .attr('style','fill:#fff;background:black;transition: .3s ease;')
                    })
 //tooltip with information
 let tooltip = d3.select('body')
 .append('div')
 .attr('id','tooltip')
 .style('opacity',0)
//tiles - use eventlistener for tooltip to show

 tiles.on('mouseover',rec=>{
    let data = (attr) => {
        return attr=='value' ? rec.target.attributes['data-value'].value : attr=='cat' ? rec.target.attributes['data-category'].value : attr=='name' ? rec.target.attributes['data-name'].value : undefined
     }
    tooltip
    .attr('style',`visibility:visible;opacity:1;left:${rec.pageX}px;top:${rec.pageY}px;`)
    .html(()=>{
        return `<p>Name:${data('name')}<p/><p>Category:${data('cat')}<p/><p>Value:${data('value')}<p/>`
    })
    .attr('data-value',data('value'))
    })   
 .on('mouseout',rec=>{
    tooltip.style('visibility','hidden')
 })

}
    //______________________________________________________________________________________________________________
    //uploading data
    let movies;
    movies = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'
    //d3.json * 3. loading data
    d3.json(movies).then(m=>{
    renderMe(m)
    })
    //______________________________________________________________________________________________________________