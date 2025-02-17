//ProposalPDF.tsx
/* eslint-disable jsx-a11y/alt-text */
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
import { generateStaticMapURL } from '@/utils/mapGenerator';

// Define styles
const styles = StyleSheet.create({
  page: {
    paddingTop: 20,     // Reduced from 40 to 20 for top only
    paddingBottom: 40,  // Keep original padding for bottom
    paddingLeft: 40,    // Keep original padding for sides
    paddingRight: 40,
    backgroundColor: '#FFFFFF',
    width: 595.28,
  },
  header: {
    marginBottom: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',  // This will vertically align items
  },
  headerLeft: {
    flex: 1,
  },
  logo: {
    width: 125,
    height: 125,
    objectFit: 'contain',
  },
  headerText: {
    fontSize: 24,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 16,
    color: '#4a4a4a',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#1a1a1a',
    marginBottom: 5,
    marginTop: 20,
    paddingBottom: 8,
    borderBottom: 1,
    borderBottomColor: '#e0e0e0',
  },
  table: {
    width: '100%',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 4,
    borderBottom: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableCell: {
    fontSize: 10,
    color: '#4a4a4a',
    padding: '0 4px',
  },
  tableCellHeader: {
    fontSize: 10,
    color: '#1a1a1a',
    fontWeight: 'bold',
    padding: '0 4px',
  },
  tableCellWide: {
    width: '30%',
  },
  tableCellMedium: {
    width: '20%',
  },
  tableCellNarrow: {
    width: '10%',
  },
  notesSection: {
    marginTop: 3,
    marginBottom: 8,
  },
  mapContainer: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  map: {
    width: 500,
    height: 300,
    objectFit: 'contain',
  },
  sectionDivider: {
    marginVertical: 30,
    borderTop: 1,
    borderTopColor: '#e0e0e0',
  },
  optionContainer: {
    marginBottom: 20,
  },
  optionColumns: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  optionLeftColumn: {
    width: '60%',
    paddingRight: 20,
  },
  optionRightColumn: {
    width: '60%',
    paddingLeft: 80,
    paddingTop: 28,
  },
  optionNumber: {
    fontSize: 16,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  aircraftModel: {
    fontSize: 20,
    color: '#1a1a1a',
    marginBottom: 4,
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceLabel: {
    fontSize: 16,
    color: '#1E40AF',
    fontWeight: 'bold',
  },
  priceValue: {
    fontSize: 16,
    color: '#1E40AF',
    fontWeight: 'bold',
  },
  noteInnerContainer: {
    position: 'relative',
    paddingLeft: 50, // Space for "Notes:" label
  },
  noteContainer: {
    marginTop: 8,
    display: 'flex',
  },
  noteLabel: {
    fontSize: 14,
    color: '#1a1a1a',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  noteValue: {
    fontSize: 14,
    color: '#1a1a1a',
    display: 'flex',
    flexWrap: 'wrap',
  },
  detailsTitle: {
    fontSize: 14,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  detailsText: {
    fontSize: 12,
    color: '#4a4a4a',
    marginBottom: 4,
  },
  imagesContainer: {
    flexDirection: 'row',
    gap: 2,
    justifyContent: 'space-between',
    marginTop: 30,  // Add some spacing from the details above
    width: '100%',  // Ensure container takes full width
    marginBottom: 0, 
  },
  aircraftImage: {
    width: '100%',   // Ensure it takes the full width of the container
    height: 200,     // Fixed height for consistency
    objectFit: 'contain', // Preserve aspect ratio
  },
  optionDivider: {
    marginVertical: 20,
    borderTop: 1,
    borderTopColor: '#e0e0e0',
  },
  disclaimer: {
    marginTop: 40,
    paddingTop: 20,
    borderTop: 1,
    borderTopColor: '#e0e0e0',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#4a4a4a',
    lineHeight: 1.4,
  },
  disclaimerBold: {
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTop: 1,
    borderTopColor: '#e0e0e0',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 8,
  },
  imageWrapper: {
    width: '48%',
    alignItems: 'center', // Center the image and text
  },
    imageCaption: {
      fontSize: 10,
      color: '#666666',
      textAlign: 'center',
      marginTop: 2,  // Small spacing from the image
  },
  companyInfo: {
    marginTop: 4,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 8,
  },
});

const ProposalPDF: React.FC<ProposalPDFProps> = (props) => {
  console.log('ProposalPDF render:', {
    option1: {
      hasImage1: !!props.option1Image1,
      hasImage2: !!props.option1Image2,
      isImage1Default: props.option1IsImage1Default,
      isImage2Default: props.option1IsImage2Default,
      image1Preview: props.option1Image1?.substring(0, 50),
      image2Preview: props.option1Image2?.substring(0, 50)
    }
  });
  const [generationDate] = useState(() => {
    const d = new Date();
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
  });

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${d.getDate()} ${months[d.getMonth()]}, ${d.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  const getOptionData = (optionNumber: number): AircraftOption => {
    const baseName = `option${optionNumber}`;
    return {
      name: props[`${baseName}Name` as keyof ProposalPDFProps] as string,
      image1: props[`${baseName}Image1` as keyof ProposalPDFProps] as string | null,
      image2: props[`${baseName}Image2` as keyof ProposalPDFProps] as string | null,
      isImage1Default: props[`${baseName}IsImage1Default` as keyof ProposalPDFProps] as boolean,
      isImage2Default: props[`${baseName}IsImage2Default` as keyof ProposalPDFProps] as boolean,
      details: props[`${baseName}Details` as keyof ProposalPDFProps] as AircraftDetails | null,
      yearOfManufacture: props[`${baseName}YearOfManufacture` as keyof ProposalPDFProps] as string | null,
      yearRefurbishment: props[`${baseName}YearRefurbishment` as keyof ProposalPDFProps] as string | null,
      price: props[`${baseName}Price` as keyof ProposalPDFProps] as string | null,
      paxCapacity: props[`${baseName}PaxCapacity` as keyof ProposalPDFProps] as string | null,
      notes: props[`${baseName}Notes` as keyof ProposalPDFProps] as string | null,
    };
  };

  const mapUrl = generateStaticMapURL(props.flightLegs);

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
      <Page size={[595.28, 'auto']} style={styles.page}>
      <View style={styles.header}>
  <View style={styles.headerLeft}>
    <Text style={styles.headerText}>Charter Offer</Text>
    {props.customerName && (
      <Text style={styles.customerName}>Prepared for: {props.customerName}</Text>
    )}
  </View>
  {props.companySettings?.logo && (
    <Image 
      src={props.companySettings.logo} 
      style={styles.logo}
    />
  )}
</View>

        <Text style={styles.sectionTitle}>Itinerary</Text>
        
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, styles.tableCellWide]}>From</Text>
            <Text style={[styles.tableCellHeader, styles.tableCellWide]}>To</Text>
            <Text style={[styles.tableCellHeader, styles.tableCellMedium]}>Departure (local)</Text>
            <Text style={[styles.tableCellHeader, styles.tableCellNarrow]}>Time</Text>
            <Text style={[styles.tableCellHeader, styles.tableCellNarrow]}>Pax</Text>
          </View>
          
          {props.flightLegs.map((leg) => (
            <View key={leg.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableCellWide]}>
                {leg.airportDetails.departure || leg.departureAirport || 'N/A'}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellWide]}>
                {leg.airportDetails.arrival || leg.arrivalAirport || 'N/A'}
              </Text>
              <Text style={[styles.tableCell, styles.tableCellMedium]}>{formatDate(leg.departureDate)}</Text>
              <Text style={[styles.tableCell, styles.tableCellNarrow]}>{leg.departureTime || 'N/A'}</Text>
              <Text style={[styles.tableCell, styles.tableCellNarrow]}>{leg.passengerCount || 'N/A'}</Text>
            </View>
          ))}
        </View>

        {props.comment && (
          <View style={styles.notesSection}>
            <Text style={{ fontSize: 12 }}>
              <Text style={{ color: '#1a1a1a', fontWeight: 'bold' }}>Notes: </Text>
              <Text style={{ color: '#1a1a1a' }}>{props.comment}</Text>
            </Text>
          </View>
        )}

<View style={styles.mapContainer}>
  <Image src={mapUrl} style={styles.map} />
</View>

        <View style={styles.sectionDivider} />

        {getValidOptions().map((option, index) => (
          <React.Fragment key={option.number}>
            {index > 0 && <View style={styles.optionDivider} />}
            <View style={styles.optionContainer}>
            <View style={styles.optionColumns}>
  <View style={styles.optionLeftColumn}>
    <Text style={styles.optionNumber}>Option {option.number}</Text>
    <Text style={styles.aircraftModel}>{option.data.name}</Text>
    {option.data.price && (
      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>Price:</Text>
        <Text style={styles.priceValue}>{option.data.price}</Text>
      </View>
    )}
{option.data.notes && (
  <View style={styles.noteContainer}>
    <View style={styles.noteInnerContainer}>
      <Text style={styles.noteLabel}>Notes:</Text>
      <Text style={styles.noteValue}>{option.data.notes}</Text>
    </View>
  </View>
)}
  </View>

  <View style={styles.optionRightColumn}>
    <Text style={styles.detailsTitle}>Aircraft Details:</Text>
    {option.data.yearOfManufacture && (
      <Text style={styles.detailsText}>
        Year of Manufacture: {option.data.yearOfManufacture}
      </Text>
    )}
    {option.data.yearRefurbishment && (
      <Text style={styles.detailsText}>
        Year of Refurbishment: {option.data.yearRefurbishment}
      </Text>
    )}
    {option.data.details?.passengerCapacity && (
      <Text style={styles.detailsText}>
        Passenger Capacity: {option.data.details.passengerCapacity}
      </Text>
    )}
    {option.data.details?.cabinHeight && (
      <Text style={styles.detailsText}>
        Cabin Height: {option.data.details.cabinHeight}
      </Text>
    )}
    {option.data.details?.cabinWidth && (
      <Text style={styles.detailsText}>
        Cabin Width: {option.data.details.cabinWidth}
      </Text>
    )}
    
{/* Disabled temporarily
{option.data.details?.baggageVolume && (
  <Text style={styles.detailsText}>
    Baggage Volume: {option.data.details.baggageVolume}
  </Text>
)}
*/}
  </View>
</View>



<View style={styles.imagesContainer}>
  {option.data.image1 && (
    <View style={styles.imageWrapper}>
      <Image 
        src={option.data.image1} 
        style={styles.aircraftImage}
        cache={false}  // Add this
      />
      {option.data.isImage1Default && (
        <Text style={styles.imageCaption}>A generic photo of this model interior</Text>
      )}
    </View>
  )}
  {option.data.image2 && (
    <View style={styles.imageWrapper}>
      <Image 
        src={option.data.image2} 
        style={styles.aircraftImage}
        cache={false}  // Add this
      />
      {option.data.isImage2Default && (
        <Text style={styles.imageCaption}>A generic photo of this model exterior</Text>
      )}
    </View>
  )}
</View>
              
            </View>
          </React.Fragment>
        ))}

<View style={styles.disclaimer}>
  <Text style={styles.disclaimerText}>
    <Text style={styles.disclaimerBold}>Please note: </Text>
    {props.companySettings?.disclaimer || "All options are subject to final availability at the time of booking, flight permits, slots, and owner's approval where applicable.\nPossible de-Icing, WI-FI and other costs are not included and will be Invoiced, if occurred, after the flight"}
  </Text>
</View>

<View style={styles.footer}>
  <Text>Charter Offer • {generationDate}</Text>
  {props.companySettings && (
    <Text style={styles.companyInfo}>
      {[
        props.companySettings.companyName,
        props.companySettings.address,
        props.companySettings.vatNumber,
        props.companySettings.email,
        props.companySettings.phoneNumber
      ].filter(Boolean).join(' | ')}
    </Text>
  )}
</View>
      </Page>
    </Document>
  );
};

export default ProposalPDF;