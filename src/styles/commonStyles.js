import { StyleSheet } from "react-native"

export const COLOR = {
    primary: '#6200EE',
    second: '#03DAC6',
    background: '#FFFFFF',
    textPrimary: '#333333',
    textSecond: '#555555',
    placeholder: '#999999',
    error: '#B00020'
}

export const TYPOGRAPHY = StyleSheet.create({
    bigText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLOR.textPrimary
    },
    smallText: {
        fontSize: 16,
        color: COLOR.textSecond
    },
    normalText: {
        fontSize: 18,
        color: COLOR.textPrimary
    },
    boldText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLOR.textPrimary
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: COLOR.background
    }
})

export const CONTAINER = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: '3%',
    },
    header: {
      flexDirection: 'row',
      height: '7%',
      alignItems: 'center',
      backgroundColor: '#00000020'
    },
    centerAligned: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    section: {
        marginVertical: 16,
        padding: 16,
        backgroundColor: COLOR.background,
        borderRadius: 8,
        shadowColor: COLOR.border,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4
    }
})

export const BUTTONS = StyleSheet.create({
    primary: {
        backgroundColor: COLOR.primary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center'
    },
    second: {
        backgroundColor: COLOR.second,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center'
    },
    disabledButton: {
        backgroundColor: COLOR.border,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center'
    }
})

export const INPUT = StyleSheet.create({
    textInput: {
      height: 48,
      borderColor: COLOR.border,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 16,
      fontSize: 16,
      color: COLOR.textPrimary,
    },
    textArea: {
      width: '100%',
      height: '100%',
      borderColor: COLOR.border,
      borderWidth: 1,
      paddingHorizontal: 16,
      paddingVertical: 8,
      fontSize: 16,
      color: COLOR.textPrimary,
      textAlignVertical: 'top',
    },
  })

  export const LAYOUT = StyleSheet.create({
    marginSmall: {
      margin: 8
    },
    marginMedium: {
      margin: 16
    },
    marginLarge: {
      margin: 24
    },
    paddingSmall: {
      padding: 8
    },
    paddingMedium: {
      padding: 16
    },
    paddingLarge: {
      padding: 24
    },
    borderRadius: {
      borderRadius: 8
    }
  })

  export const SHADOWS = StyleSheet.create({
    shadow: {
      shadowColor: COLOR.border,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2, // Android shadow
    },
  })