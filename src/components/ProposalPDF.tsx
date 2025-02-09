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
import type { ProposalPDFProps, AircraftDetails, AircraftOption } from '@/types/proposal';

// Define styles
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
  const [generationDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });

  // Helper function to render aircraft details
  const renderAircraftDetails = (details: {
    cabinWidth: string | null;
    cabinHeight: string | null;
    baggageVolume: string | null;
    passengerCapacity: string;
  } | null) => {
    if (!details) return null;

    return (
      <>
        {details.cabinWidth && details.cabinHeight && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Cabin Dimensions:</Text>
            <Text style={styles.value}>
              {details.cabinWidth} × {details.cabinHeight}
            </Text>
          </View>
        )}
        
        {details.baggageVolume && (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Baggage Volume:</Text>
            <Text style={styles.value}>{details.baggageVolume}</Text>
          </View>
        )}
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>Passenger Capacity:</Text>
          <Text style={styles.value}>{details.passengerCapacity}</Text>
        </View>
      </>
    );
  };

  // Helper function to render images
  const renderImages = (image1: string | null, image2: string | null) => {
    if (!image1 && !image2) return null;

    return (
      <View style={styles.imageContainer}>
        {image1 && (
          <Image 
            src={image1.startsWith('data:image') ? image1 : `data:image/jpeg;base64,${image1}`} 
            style={styles.image} 
          />
        )}
        {image2 && (
          <Image 
            src={image2.startsWith('data:image') ? image2 : `data:image/jpeg;base64,${image2}`} 
            style={styles.image} 
          />
        )}
      </View>
    );
  };

  const getOptionData = (optionNumber: number): AircraftOption => {
    const baseName = `option${optionNumber}`;
    return {
      name: props[`${baseName}Name` as keyof ProposalPDFProps] as string,
      image1: props[`${baseName}Image1` as keyof ProposalPDFProps] as string | null,
      image2: props[`${baseName}Image2` as keyof ProposalPDFProps] as string | null,
      details: props[`${baseName}Details` as keyof ProposalPDFProps] as AircraftDetails | null,
    };
  };

  // Get all options that have data
  const getValidOptions = () => {
    return Array.from({ length: 5 }, (_, i) => i + 1)
      .map(num => ({
        number: num,
        data: getOptionData(num)
      }))
      .filter(option => option.data.name);
  };

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
              {props.airportDetails?.departure || props.departureAirport || 'N/A'} - {props.airportDetails?.arrival || props.arrivalAirport || 'N/A'}
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

      {/* Dynamic Option Pages */}
      {getValidOptions().map((option, index) => (
        <Page key={option.number} size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Option {option.number}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Aircraft Type:</Text>
              <Text style={styles.value}>{option.data.name}</Text>
            </View>

            {renderAircraftDetails(option.data.details)}
            {renderImages(option.data.image1, option.data.image2)}
          </View>

          <Text style={styles.footer}>Private Jet Charter Proposal • {generationDate}</Text>
          <Text style={styles.pageNumber}>{index + 2}</Text>
        </Page>
      ))}
    </Document>
  );
};

export default ProposalPDF;