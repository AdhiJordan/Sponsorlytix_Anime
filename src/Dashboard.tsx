import React, { useState, useEffect, MouseEvent } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

function Dashboard() {
    const [getAnimeList, setAnimeList] = useState<any[]>([]);
    const [getAnimeChartData, setAnimeChartData] = useState<any[]>([]);
    const [getAnimeChartTooltipData, setAnimeChartTooltipData] = useState<
        any[]
    >([]);
    const [getSelectedCard, setSelectedCard] = useState<any | number>(null);

    const groupBy = (array: any, name: any) => {
        var group_to_values = array.reduce(function (obj: any, item: any) {
            obj[item.name] = obj[item.name] || [];
            obj[item.name].push(item.title);
            return obj;
        }, {});

        var groups = Object.keys(group_to_values).map(function (key) {
            return { name: key, title: group_to_values[key] };
        });
        return groups;
    };

    useEffect(() => {
        axios.get(`https://api.jikan.moe/v4/top/anime`).then((response) => {
            if (response) {
                setAnimeList(response.data.data);
                let getChartData = response.data.data.map((item: any) => {
                    if (item.year !== null) {
                        return {
                            name: item.year,
                            uv: item.rank,
                            pv: item.rank,
                            title: item.title,
                        };
                    }
                });
                let sortedList = getChartData.sort(
                    (a: any, b: any) => parseFloat(a.year) - parseFloat(b.year)
                );
                let getProperList = sortedList.filter(function (element: any) {
                    return element !== undefined;
                });
                let getSortedData = groupBy(getProperList, 'name');
                let finalResult = getSortedData.map((data: any) => {
                    return {
                        name: data.name,
                        uv: data.title.length,
                        pv: data.title.length,
                    };
                });
                setAnimeChartData(finalResult);
                setAnimeChartTooltipData(groupBy(getProperList, 'name'));
            }
        });
    }, []);

    const handleHoverChange = (event: MouseEvent, cardIndex: Number) => {
        setSelectedCard(cardIndex);
    };

    const handleReleaseChange = (event: MouseEvent) => {
        setSelectedCard(null);
    };

    const CustomTooltip = (active: any) => {
        return (
            <div className="custom-tooltip">
                {active.active === true &&
                    active.chartData &&
                    active.chartData.map((data: any) => {
                        if (Number(data.name) === Number(active.label)) {
                            return data.title.map((details: any, id: any) => {
                                return (
                                    <div key={id}>
                                        <p>{details}</p>
                                    </div>
                                );
                            });
                        }
                    })}
            </div>
        );
    };

    return (
        <div>
            <div className="container-fluid">
                <div className="row">
                    {getAnimeList &&
                        getAnimeList.map((anime, index) => {
                            if (index < 20) {
                                return (
                                    <div
                                        className="col-12 col-sm-12 col-md-4 col-lg-2 col-xl-2"
                                        key={index}
                                    >
                                        <div
                                            className={
                                                getSelectedCard === index
                                                    ? 'card mt-4 zoom'
                                                    : 'card mt-4'
                                            }
                                            style={{
                                                position: 'relative',
                                                height: '300px',
                                            }}
                                            onMouseDown={(e) =>
                                                handleHoverChange(
                                                    e,
                                                    Number(index)
                                                )
                                            }
                                            onMouseUp={(e) =>
                                                handleReleaseChange(e)
                                            }
                                        >
                                            <img
                                                src={anime.images.jpg.image_url}
                                                alt={anime.title}
                                                height="250px"
                                                className="object-fit"
                                            />
                                            <span className="rankBox">
                                                {anime.rank}
                                            </span>
                                            <div>
                                                <div className="card-text text-elipsis">
                                                    {anime.title}
                                                </div>
                                                {getSelectedCard === index && (
                                                    <div className="card-text textDetails p-2">
                                                        <div className="card-text">
                                                            <b className="font-14">
                                                                Release:{' '}
                                                            </b>{' '}
                                                            <label className="font-10">
                                                                {anime.aired
                                                                    .from !==
                                                                null
                                                                    ? new Date(
                                                                          anime.aired.from
                                                                      ).toDateString()
                                                                    : 'now'}
                                                            </label>
                                                        </div>
                                                        <div className="card-text">
                                                            <b className="font-14">
                                                                Latest:{' '}
                                                            </b>{' '}
                                                            <label className="font-10">
                                                                {anime.aired
                                                                    .to !== null
                                                                    ? new Date(
                                                                          anime.aired.to
                                                                      ).toDateString()
                                                                    : 'now'}
                                                            </label>
                                                        </div>
                                                        <div className="card-text">
                                                            <b className="font-14">
                                                                Rating:{' '}
                                                            </b>{' '}
                                                            <label className="font-10">
                                                                {anime.rating}
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        })}
                </div>
            </div>
            <h2 className="mt-5 mb-5 text-center">
                Anime Chart Representation
            </h2>
            <ResponsiveContainer width="95%" height={400}>
                <AreaChart
                    data={getAnimeChartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient
                            id="colorUv"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#8884d8"
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor="#8884d8"
                                stopOpacity={0}
                            />
                        </linearGradient>
                        <linearGradient
                            id="colorPv"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#82ca9d"
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor="#82ca9d"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip
                        content={
                            <CustomTooltip
                                chartData={getAnimeChartTooltipData}
                            />
                        }
                    />
                    <Area
                        type="monotone"
                        dataKey="uv"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorUv)"
                    />
                    <Area
                        type="monotone"
                        dataKey="pv"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorPv)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export default Dashboard;
