import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native'

import { Card } from 'react-native-paper'
import { FlatList, ScrollView } from 'react-native-gesture-handler';

import Loader from '../business/Loader';
import { EventObject } from '../data/EventObject'

import { subscribeToAuthChanges } from '../business/FirebaseSetup'
import * as firebase from 'firebase'

import { homeStyles, mainStyles, generalStyles } from './style'

/* The Home page of my app. This screen displays upcoming events, and provides 
naviagation to other pages.*/
class HomeScreen extends Component {

    state = {
        loading: true,
        events: [],
        pastEvents: []
    }

    /* Methods that update the page when imformation from firestore is updated, or they are called */
    componentDidMount() {
        subscribeToAuthChanges(this.onAuthStateChanged)
    }

    // When the page is loaded, loads all the events from firebase and stores them in a map.
    onAuthStateChanged = (user) => {
        if (user === null) {
            user === undefined;
            this.props.navigation.navigate('Auth');
        }
        else {
            let uEvents = [];
            let pEvents = [];

            const uid = user.uid
            const eventsRef = firebase.firestore().collection("users").doc(uid).collection("events")
            eventsRef.get().then((querySnapshot) => {
                querySnapshot.docs.forEach((doc) => {
                    let e = new EventObject(
                        doc.get("id"),
                        doc.get("dayEvents"),
                        doc.get("date"),
                        doc.get("location"),
                        doc.get("startHour"),
                        doc.get("startMinutes"),
                        doc.get("endHour"),
                        doc.get("endMinutes"),
                        doc.get("latitude"),
                        doc.get("longitude")
                    );

                    // Checks if the event is upcoming or has past.
                    if (doc.get("date") >= new Date().toISOString().split("T")[0]) {
                        uEvents.push(e);
                    }
                    else {
                        pEvents.push(e);
                    }

                })

                // Sorts the upcoming events by date.
                uEvents.sort(function (a, b) {

                    if (a.getDate() < b.getDate()) {
                        return -1;
                    }
                    else {
                        return 1;
                    }
                });

                // Sorts the past events by most recent.
                pEvents.sort(function (a, b) {

                    if (a.getDate() < b.getDate()) {
                        return 1;
                    }
                    else {
                        return -1;
                    }
                });

                this.setState({ events: uEvents, pastEvents: pEvents, loading: false })
            });
        }
    }

    // Allows the page to recieve props from other pages then refreshes the page.
    componentWillReceiveProps(nextProps) {
        if (nextProps.navigation.state.params.token) {
            this.setState({ loading: true })
            this.componentDidMount();
        }
    }

    render() {

        /* Shows loading graphic when page is loading. */
        if (this.state.loading) {
            return (
                <Loader />
            )
        }
        return (
            <View style={mainStyles.container}>

                <View style={mainStyles.header}>
                    <Text style={generalStyles.title}>Home</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={homeStyles.background}>
                    <Text style={homeStyles.listTitle}> Upcoming Events </Text>

                    <ScrollView showsVerticalScrollIndicator={false} style={homeStyles.listView}>
                        {this.state.events === undefined || this.state.events.length === 0 ? (
                            <Text style={homeStyles.noText}> No Upcoming Events! </Text>

                        ) : <>
                            </>}
                        {/* Renders all the upcoming events in a scrollable list. */}
                        <FlatList
                            data={this.state.events}
                            renderItem={({ item }) =>
                                <TouchableOpacity>

                                    <Card style={homeStyles.listCard}>
                                        <View>
                                            <Text style={homeStyles.cardDate}> {item.getDate()} </Text>
                                            <Text> {"Name: " + item.getName()}</Text>
                                            <Text> {"Location: " + item.getLocation()} </Text>
                                            <Text style={homeStyles.cardDate}> {item.getStartHour() + ":" + item.getStartMinutes() + " - " + item.getEndHour() + ":" + item.getEndMinutes()}</Text>
                                        </View>
                                    </Card>

                                </TouchableOpacity>
                            }
                        >

                        </FlatList>


                    </ScrollView>

                    <Text style={homeStyles.listTitle}> Past Events </Text>

                    <ScrollView showsVerticalScrollIndicator={false} style={homeStyles.listView}>

                        {this.state.pastEvents === undefined || this.state.pastEvents.length === 0 ? (
                            <Text style={homeStyles.noText}> No Past Events! </Text>

                        ) : <>
                            </>}

                        {/* Renders the past events in a scrollable list. */}
                        <FlatList
                            data={this.state.pastEvents}
                            renderItem={({ item }) =>
                                <TouchableOpacity>

                                    <Card style={homeStyles.listCard}>
                                        <View>
                                            <Text style={homeStyles.cardDate}> {item.getDate()} </Text>
                                            <Text> {"Name: " + item.getName()}</Text>
                                            <Text> {"Location: " + item.getLocation() + " (" + (item.getLatitude()).toFixed(4) + ", " + item.getLongitude().toFixed(4) + ")"} </Text>
                                            <Text style={homeStyles.cardDate}> {item.getStartHour() + ":" + item.getStartMinutes() + " - " + item.getEndHour() + ":" + item.getEndMinutes()}</Text>
                                        </View>
                                    </Card>

                                </TouchableOpacity>
                            }
                        >

                        </FlatList>
                    </ScrollView>

                </ScrollView>


            </View>
        )
    }
}

export default HomeScreen;