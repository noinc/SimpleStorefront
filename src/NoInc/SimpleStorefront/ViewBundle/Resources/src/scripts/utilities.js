// Generate a color based on the root color given for this chart.
// This allows a bit more finesse over the hue change in the chart- making it relative
// to the number of items

// eslint-disable-next-line no-unused-vars
const renderPieChart = (target, fullData, title, baseColor, callback) => {
    angular.element(document.getElementById(target)).html(null);
    const data = fullData.items;

    if (!baseColor) {
        baseColor = 'rgb(0, 117, 201)';
    }

    data.forEach((item, index) => {
        if (!item.color) {
            item.color = tinycolor(baseColor).darken(100 * (index / (data.length + 8)));
        }
    });

    // If we don't have valid data for a chart, run away!
    if (!fullData || fullData.items === undefined) {
        angular.element(document.getElementById(target)).html('<p class="text-left">Error loading data.</p>');
        return;
    }

    // Height should have space for the donut, plus however big the legend needs to be
    const height = 625; // document.getElementById(target).clientHeight; //(width + data.length * 35) + 10;
    const width = document.getElementById(target).clientHeight * 0.5 > window.innerWidth - 100 ? window.innerWidth - 100 : document.getElementById(target).clientHeight * 0.5;
    const radius = Math.min(width, height) / 2;
    const radiusHole = radius * 0.55;

    const arc = d3.arc()
        .outerRadius(radius - 15)
        .innerRadius(radiusHole);

    const arcExpanded = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radiusHole);

    const arcHighlight = d3.arc()
        .outerRadius(radius)
        .innerRadius(radiusHole);

    const pie = d3.pie()
        .sort(null)
        .value(d => d.count);

    const tip = d3.tip()
        .attr('class', 'd3-tip md-whiteframe-2dp')
        .html(d => `<span class="tip">${d.data.name}<strong> ${d.data.count}</strong><span>`);

    const svg = d3.select(`#${target}`).append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        // Put the donut chart at the top of this svg, so the legend goes below it. this is intentional positioning.
        .attr('transform', `translate(${(width / 2) - 8},${width / 2})`);

    svg.call(tip);

    const g = svg.selectAll('.arc')
        .data(pie(data))
        .enter().append('g')
        .attr('class', 'arc');

    const legendDotSize = 20;
    const legend = svg.append('g')
        .attr('transform', `translate(-${parseInt((width / 2) - legendDotSize, 0)},${parseInt((width / 2) + (legendDotSize * 2.5), 0)})`);

    const legendElement = legend.selectAll('.legend-item')
        .data(pie(data))
        .enter().append('g')
        .attr('class', 'legend-item');

    legendElement.append('rect')
        .style('fill', d => d.data.color)
        .style('stroke-width', '1px')
        // ESLint isn't really happy with any way of writing this next line, so this is pretty clear.
        // eslint-disable-next-line arrow-body-style
        .style('stroke', (d) => { return d.data.stroke_color ? d.data.stroke_color : d.data.color; })
        .attr('width', legendDotSize)
        .attr('height', legendDotSize)
        .attr('x', 0)
        .attr('y', (d, i) => 1.5 * legendDotSize * i)
        .on('mouseenter', (d) => {
            d3.select(document.getElementById(target)).selectAll('.donut-highlight')
                .classed('hover', el => el.data.name === d.data.name);
        })
        .on('mouseleave', () => {
            d3.select(document.getElementById(target)).selectAll('.donut-highlight')
                .classed('hover', false);
        })
        .on('click', (d) => {
            tip.hide(d);
            callback(d.data.id);
        });
    legendElement.append('text')
        .attr('dy', (d, i) => (1.5 * legendDotSize * i) + (legendDotSize * 0.75))
        .attr('dx', legendDotSize + 15)
        .html((d) => {
            if (fullData.total) {
                return `<tspan class="data">${d.data.count}</tspan> ${d.data.name} (${parseFloat(100 * (d.data.count / fullData.total)).toFixed(2)}%)`;
            }

            return `<tspan class="data">${d.data.count}</tspan> ${d.data.name}`;
        })
        .on('mouseenter', (d) => {
            d3.select(document.getElementById(target)).selectAll('.donut-highlight')
                .classed('hover', el => el.data.name === d.data.name);
        })
        .on('mouseleave', () => {
            d3.select(document.getElementById(target)).selectAll('.donut-highlight')
                .classed('hover', false);
        })
        .on('click', (d) => {
            tip.hide(d);
            callback(d.data.id);
        });

    svg.append('circle')
        .style('stroke', 'rgb(252, 125, 60)')
        .style('pointer-events', 'none')
        .style('stroke-width', 0)
        .style('fill', 'none')
        .attr('r', ((radius + radiusHole) - 10) / 2)
        .attr('cx', 0)
        .attr('cy', 0);

    g.append('path')
        .attr('d', arcHighlight)
        .attr('class', d => `donut-highlight ${d.data.name}`)
        .style('fill', d => d.data.color);

    g.append('path')
        .attr('d', arc)
        .attr('class', d => `donut-chart-section ${d.data.name}`)
        // Because ES6 changed the definition of "this", we cannot use arrow notation for this function!
        // eslint-disable-next-line func-names
        .on('mouseenter', function (d) {
            tip.show(d);
            d3.select(document.getElementById(target)).selectAll('.donut-highlight')
                .classed('hover', el => el.data.name === d.data.name);
            d3.select(this)
                .transition()
                .duration(300)
                .attr('d', arcExpanded);
        })
        // Because ES6 changed the definition of "this", we cannot use arrow notation for this function!
        // eslint-disable-next-line func-names
        .on('mouseleave', function (d) {
            tip.hide(d);
            d3.select(document.getElementById(target)).selectAll('.donut-highlight')
                .classed('hover', false);
            d3.select(this)
                .transition()
                .duration(300)
                .attr('d', arc);
        })
        .on('mousemove', () => {
            tip.style('left', `${d3.event.pageX + 10}px`).style('top', `${d3.event.pageY + 10}px`);
        })
        .on('click', (d) => {
            tip.hide(d);
            callback(d.data.id);
        })
        .style('fill', d => d.data.color)
        .style('stroke-width', '1px')
        // ESLint isn't really happy with any way of writing this next line, so this is pretty clear.
        // eslint-disable-next-line arrow-body-style
        .style('stroke', (d) => { return d.data.stroke_color ? d.data.stroke_color : d.data.color; });

    svg.append('text')
        .attr('class', 'piechart-title md-title')
        .attr('dy', '1.5em')
        .style('text-anchor', 'middle')
        .html(() => `<tspan class="title">${title}</tspan>`);

    svg.append('text')
        .attr('class', 'piechart-title-data md-display-1')
        .attr('dy', '0em')
        .style('text-anchor', 'middle')
        .html(() => `<tspan class="data">${fullData.total}</tspan>`);
};
