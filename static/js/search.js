pencilHover();
var loadMore = function () {
    const order = document.querySelector('input[name="order"]:checked').value;
    const query = localStorage.getItem('query');
    const request = new XMLHttpRequest();
    resultContainer = document.querySelector('#resultContainer');
    request.open('POST', '/fetch');
    request.setRequestHeader('Cache-Control', 'no-cache');
    var csrftoken = getCookie('_csrf_token');
    request.setRequestHeader("X-CSRFToken", csrftoken);


    request.onreadystatechange = function () {
        try {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    const data = JSON.parse(request.responseText);

                    if (data.results.length > 0) {

                        if (document.querySelector('.loadMore')) {
                            document.querySelector('#resultContainer').removeChild(document.querySelector(
                                '.loadMore'));
                        }

                        for (i = 0; i < data.results.length; i++) {
                            a = document.createElement('a');
                            a.setAttribute('href', '../book/' + data.results[i][0]);
                            a.setAttribute('target', '_blank');

                            resultItem = document.createElement('div');
                            resultItem.setAttribute('class', 'resultItem');

                            h2 = document.createElement('h2');
                            h2.innerText = data.results[i][1];
                            resultItem.appendChild(h2);

                            p = document.createElement('p');
                            p.innerHTML = `By <strong>${data.results[i][2]}</strong>`;
                            resultItem.appendChild(p);

                            p2 = document.createElement('p');
                            p2.innerHTML = `ISBN : <strong>${data.results[i][3]}</strong>`;
                            resultItem.append(p2);

                            a.appendChild(resultItem);
                            resultContainer.appendChild(a);
                        }

                        load = document.createElement('div');
                        load.setAttribute('class', 'loadMore');
                        load.innerHTML = '<h2>Load More</h2>';
                        load.addEventListener("click", loadMore);
                        resultContainer.appendChild(load);
                    } else {
                        document.querySelector('.loadMore').remove();
                    }
                } else {
                    console.log("There was a problem with the request");
                }
            } else if (request.readyState === XMLHttpRequest.LOADING) {
                console.log('loading...');
            }
        } catch (err) {
            console.log(err);
        }
    }

    const data = new FormData();
    data.append('query', query);
    data.append('order', order);
    data.append('offset', resultContainer.children.length);
    request.send(data);
}

document.addEventListener('DOMContentLoaded',
    function () {
        document.querySelector("#search-form").onsubmit = function (e) {
            e.preventDefault();
        }

        document.querySelector('#submit').onclick = function () {


            const order = document.querySelector('input[name="order"]:checked').value;
            const query = document.querySelector("#query").value;

            localStorage.setItem('query', query);

            try {
                search = document.querySelector('.SearchTitle');
                document.body.removeChild(search);

                results = document.querySelector('#resultContainer');
                document.body.removeChild(results);
            } catch (err) {
                console.log(err);
            }

            const request = new XMLHttpRequest();
            request.open('POST', '/fetch');
            var csrftoken = getCookie('_csrf_token');
            request.setRequestHeader("X-CSRFToken", csrftoken);


            request.onreadystatechange = function () {
                try {
                    if (request.readyState === XMLHttpRequest.DONE) {
                        if (request.status === 200) {
                            const data = JSON.parse(request.responseText);

                            if (data.results.length > 0) {

                                document.querySelector('.SearchContainer').insertAdjacentHTML(
                                    "afterend",
                                    "<div class='SearchTitle'><h2>Search Results are...</h2></div><div id='resultContainer'></div>"
                                );

                                if (document.querySelector('.spinner')) {
                                    document.body.removeChild(document.querySelector(
                                        '.spinner'));
                                }

                                if (document.querySelector('.notFound')) {
                                    document.body.removeChild(document.querySelector(
                                        '.notFound'));
                                }

                                resultContainer = document.querySelector('#resultContainer');
                                for (i = 0; i < data.results.length; i++) {
                                    a = document.createElement('a');
                                    a.setAttribute('href', '../book/' + data.results[i][0]);
                                    a.setAttribute('target', '_blank');

                                    resultItem = document.createElement('div');
                                    resultItem.setAttribute('class', 'resultItem');

                                    h2 = document.createElement('h2');
                                    h2.innerText = data.results[i][1];
                                    resultItem.appendChild(h2);

                                    p = document.createElement('p');
                                    p.innerHTML = `By <strong>${data.results[i][2]}</strong>`;
                                    resultItem.appendChild(p);

                                    p2 = document.createElement('p');
                                    p2.innerHTML = `ISBN : <strong>${data.results[i][3]}</strong>`;
                                    resultItem.append(p2);

                                    a.appendChild(resultItem);
                                    resultContainer.appendChild(a);
                                }

                                load = document.createElement('div');
                                load.setAttribute('class', 'loadMore');
                                load.innerHTML = '<h2>Load More</h2>';
                                load.addEventListener("click", loadMore);
                                console.log(load);
                                resultContainer.appendChild(load);


                            } else {
                                if (document.querySelector('.spinner')) {
                                    document.body.removeChild(document.querySelector(
                                        '.spinner'));
                                }

                                if (document.querySelector('.notFound')) {
                                    document.body.removeChild(document.querySelector(
                                        '.notFound'));
                                }

                                document.querySelector('.SearchContainer').insertAdjacentHTML(
                                    "afterend",
                                    "<div class='notFound'><h2>No results found!</h2></div>");
                            }
                        } else {
                            console.log("There was a problem with the request");
                        }
                    }

                } catch (err) {
                    console.log(err);
                }
            }

            const data = new FormData();
            data.append('query', query);
            data.append('order', order);
            console.log('Sending request');
            request.send(data);

            if (document.querySelector('.notFound')) {
                document.body.removeChild(document.querySelector(
                    '.notFound'));
            }

            document.querySelector('.SearchContainer').insertAdjacentHTML(
                "afterend",
                `<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>`
            );
        }
    });

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}