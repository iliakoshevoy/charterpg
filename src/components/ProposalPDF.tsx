// src/components/ProposalPDF.tsx
"use client";
import React, { useState } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

// Define types for our props
export interface ProposalPDFProps {
  customerName: string;
  departureDate: string;
  departureTime: string;
  departureAirport: string;
  arrivalAirport: string;
  passengerCount: string;
  comment: string;
  option1Name: string;
  option1Image: string | null;
  option1Details: {
    cabinWidth: string | null;
    cabinHeight: string | null;
    baggageVolume: string | null;
    passengerCapacity: string;
  } | null;
  option2Name: string;
  option2Image: string | null;
  option2Details: {
    cabinWidth: string | null;
    cabinHeight: string | null;
    baggageVolume: string | null;
    passengerCapacity: string;
  } | null;
}

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: '#FFFFFF',
  },
  header: {
    borderBottom: 2,
    borderBottomColor: '#1E40AF',
    paddingBottom: 15,
    marginBottom: 30,
  },
  headerText: {
    color: '#1E40AF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 10,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#1E40AF',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingVertical: 5,
  },
  label: {
    width: '30%',
    fontSize: 12,
    color: '#4B5563',
  },
  value: {
    flex: 1,
    fontSize: 12,
    color: '#111827',
  },
  imageContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  image: {
    width: 450,
    height: 300,
    objectFit: 'contain',
  },
  aircraftOption: {
    backgroundColor: '#F3F4F6',
    padding: 20,
    marginTop: 20,
    borderRadius: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 50,
    right: 50,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 10,
    borderTop: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 50,
    fontSize: 10,
    color: '#6B7280',
  },
});

const ProposalPDF: React.FC<ProposalPDFProps> = (props) => {
  const formatDate = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  
  const [generationDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  return (
    <Document>
      {/* First Page - Main Information */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Private Jet Charter Proposal</Text>
          <Text style={styles.subHeader}>Prepared for: {props.customerName || 'N/A'}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flight Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Departure Date:</Text>
            <Text style={styles.value}>{props.departureDate || 'N/A'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>Departure Time:</Text>
            <Text style={styles.value}>{props.departureTime || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Route:</Text>
            <Text style={styles.value}>
              {props.departureAirport || 'N/A'} → {props.arrivalAirport || 'N/A'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Number of Passengers:</Text>
            <Text style={styles.value}>{props.passengerCount || 'N/A'}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Additional Comments:</Text>
            <Text style={styles.value}>{props.comment || 'N/A'}</Text>
          </View>
        </View>

        <Text style={styles.footer}>Private Jet Charter Proposal • {generationDate}</Text>
        <Text style={styles.pageNumber}>1</Text>
      </Page>

      {/* Option 1 Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Option 1</Text>
        </View>

        <View style={styles.section}>
          {props.option1Name && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Aircraft Type:</Text>
              <Text style={styles.value}>{props.option1Name}</Text>
            </View>
          )}

          {props.option1Details && (
            <>
              {props.option1Details.cabinWidth && props.option1Details.cabinHeight && (
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Cabin Dimensions:</Text>
                  <Text style={styles.value}>
                    {props.option1Details.cabinWidth} × {props.option1Details.cabinHeight}
                  </Text>
                </View>
              )}
              
              {props.option1Details.baggageVolume && (
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Baggage Volume:</Text>
                  <Text style={styles.value}>{props.option1Details.baggageVolume}</Text>
                </View>
              )}
              
              <View style={styles.detailRow}>
                <Text style={styles.label}>Passenger Capacity:</Text>
                <Text style={styles.value}>{props.option1Details.passengerCapacity}</Text>
              </View>
            </>
          )}

          {props.option1Image && (
            <View style={styles.imageContainer}>
              <Image src={props.option1Image} style={styles.image} />
            </View>
          )}
        </View>

        <Text style={styles.footer}>Private Jet Charter Proposal • {generationDate}</Text>
        <Text style={styles.pageNumber}>2</Text>
      </Page>

      {/* Option 2 Page - Only render if there's content */}
      {(props.option2Name) && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Option 2</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Aircraft Type:</Text>
              <Text style={styles.value}>{props.option2Name}</Text>
            </View>

            {props.option2Details && (
              <>
                {props.option2Details.cabinWidth && props.option2Details.cabinHeight && (
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Cabin Dimensions:</Text>
                    <Text style={styles.value}>
                      {props.option2Details.cabinWidth} × {props.option2Details.cabinHeight}
                    </Text>
                  </View>
                )}
                
                {props.option2Details.baggageVolume && (
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Baggage Volume:</Text>
                    <Text style={styles.value}>{props.option2Details.baggageVolume}</Text>
                  </View>
                )}
                
                <View style={styles.detailRow}>
                  <Text style={styles.label}>Passenger Capacity:</Text>
                  <Text style={styles.value}>{props.option2Details.passengerCapacity}</Text>
                </View>
              </>
            )}

            {props.option2Image && (
              <View style={styles.imageContainer}>
                <Image src={props.option2Image} style={styles.image} />
              </View>
            )}
          </View>

          <Text style={styles.footer}>Private Jet Charter Proposal • {generationDate}</Text>
          <Text style={styles.pageNumber}>3</Text>
        </Page>
      )}
    </Document>
  );
};

export default ProposalPDF;