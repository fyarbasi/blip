/** @jsx React.DOM */
/**
 * Copyright (c) 2014, Tidepool Project
 * 
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 * 
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 */

var React = window.React;
var _ = window._;

var user = require('../../core/user');
var patient = require('../../core/patient');

var DATE_DISPLAY_FORMAT = 'MMM D, YYYY';

var Patient = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
    fetchingUser: React.PropTypes.bool,
    patient: React.PropTypes.object,
    fetchingPatient: React.PropTypes.bool
  },

  patientDisplayAttributes: [
    {name: 'firstName', label: 'First name'},
    {name: 'lastName', label: 'Last name'},
    {name: 'aboutMe', label: 'About me'},
    {
      name: 'age',
      label: 'Age',
      getValue: function(patient) {
        // `this` is bound to the component
        return this.getAgeDisplayText(patient);
      }
    },
    {
      name: 'diagnosisYearsAgo',
      label: 'Diagnosed',
      getValue: function(patient) {
        return this.getDiagnosisDisplayText(patient);
      }
    }
  ],

  render: function() {
    var subnav = this.renderSubnav();
    var editLink = this.renderEditLink();
    var patient = this.renderPatient();

    /* jshint ignore:start */
    return (
      <div className="patient">
        {subnav}
        <div className="container-box-outer patient-content-outer">
          <div className="container-box-inner patient-content-inner">
            <div className="patient-content">
              {editLink}
              {patient}
            </div>
          </div>
        </div>
      </div>
    );
    /* jshint ignore:end */
  },

  renderSubnav: function() {
    var backUrl = this.getBackUrl();

    /* jshint ignore:start */
    return (
      <div className="container-box-outer patient-subnav-outer">
        <div className="container-box-inner patient-subnav-inner">
          <div className="grid patient-subnav">
            <div className="grid-item one-whole medium-one-third">
              <a href={backUrl}>
                <i className="icon-back"></i>
                {' ' + 'Back'}
              </a>
            </div>
            <div className="grid-item one-whole medium-one-third">
              <div className="patient-subnav-title">Patient profile</div>
            </div>
          </div>
        </div>
      </div>
    );
    /* jshint ignore:end */
  },

  getBackUrl: function() {
    var backUrl = '#/';
    var patient = this.props.patient;

    if (patient && patient.id) {
      backUrl = '#/patients/' + patient.id + '/data';
    }

    return backUrl;
  },

  renderEditLink: function() {
    if (!this.isUserPatient()) {
      return null;
    }

    var editUrl = [
      '#/patients',
      this.props.patient.id,
      'edit'
    ].join('/');

    /* jshint ignore:start */
    return (
      <div className="patient-content-edit">
        <a href={editUrl}>
          <i className="icon-profile"></i>
          {' ' + 'Edit patient profile'}
        </a>
      </div>
    );
    /* jshint ignore:end */
  },

  isUserPatient: function() {
    return user.isUserPatient(this.props.user, this.props.patient);
  },

  renderPatient: function() {
    var patient = this.props.patient || {};
    
    var attributes = this.prepareDisplayAttributes(patient);

    return this.renderPatientAttributes(attributes);
  },

  prepareDisplayAttributes: function(patient) {
    var self = this;
    var fetching = this.props.fetchingPatient;

    return _.map(this.patientDisplayAttributes, function(attribute) {
      if (attribute.getValue) {
        attribute.value = attribute.getValue.call(self, patient);
      } else {
        attribute.value = patient[attribute.name];
      }
      attribute.fetching = fetching;
      return attribute;
    });
  },

  renderPatientAttributes: function(attributes) {
    var attributeNodes = _.map(attributes, this.renderPatientAttribute);

    /* jshint ignore:start */
    return (
      <div className="patient-attributes">
        {attributeNodes}
      </div>
    );
    /* jshint ignore:end */
  },

  renderPatientAttribute: function(attribute) {
    if (!(attribute.value || attribute.fetching)) {
      return null;
    }

    var className = 'patient-attribute';
    if (attribute.fetching && !attribute.value) {
      className = className + ' patient-attribute-empty';
    }

    /* jshint ignore:start */
    return (
      <div key={attribute.name} className={className}>
        <div className="patient-attribute-value">{attribute.value}</div>
        <div className="patient-attribute-label">{attribute.label}</div>
      </div>
    );
    /* jshint ignore:end */
  },

  getAgeDisplayText: function(patientAttr) {
    var birthday = patientAttr.birthday;

    if (!birthday) {
      return;
    }

    var yearsOld = patient.getYearsOldText(birthday);
    var birthdayDisplay = moment(birthday).format(DATE_DISPLAY_FORMAT);

    return [yearsOld, ' (', birthdayDisplay, ')'].join('');
  },

  getDiagnosisDisplayText: function(patientAttr) {
    var diagnosisYear = patientAttr.diagnosisYear;

    if (!diagnosisYear) {
      return;
    }

    var yearsAgo = patient.getYearsAgoText(diagnosisYear);

    return [yearsAgo, ' (', diagnosisYear, ')'].join('');
  }
});

module.exports = Patient;