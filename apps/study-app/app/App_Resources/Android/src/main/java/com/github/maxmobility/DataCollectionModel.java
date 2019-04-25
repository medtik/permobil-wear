package com.github.maxmobility;

import android.hardware.Sensor;
import android.location.Location;

import com.google.api.client.json.GenericJson;
import com.google.api.client.util.Key;

import java.util.ArrayList;
import java.util.List;

public class DataCollectionModel extends GenericJson {

/*
    @Key("_id")
    public String id;
    @Key("_kmd")
    private KinveyMetaData meta; // Kinvey metadata, OPTIONAL
    @Key("_acl")
    private KinveyMetaData.AccessControlList acl; //Kinvey access control, OPTIONAL
*/

    @Key
    public ArrayList<SensorServiceData> sensor_data;

    @Key
    public List<Sensor> sensor_list;

    @Key
    public String device_manufacturer;

    @Key
    public String device_model;

    @Key
    public String device_os_version;

    @Key
    public int device_sdk_version;

    @Key
    public String device_uuid;

    @Key
    public String user_identifier;

    @Key
    public Location location;

    public DataCollectionModel() {

    }
}
